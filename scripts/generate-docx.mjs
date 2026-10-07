import { readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCvModel } from "../src/cv/model.js";
import { portfolioFor, locales } from "../src/data/portfolio.js";
import { createZip } from "./zip.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function xml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraph(text, style) {
  const props = style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : "";
  return `<w:p>${props}<w:r><w:t xml:space="preserve">${xml(text)}</w:t></w:r></w:p>`;
}

function richParagraph(parts) {
  const runs = parts
    .map((part) => {
      const bold = part.bold ? "<w:rPr><w:b/></w:rPr>" : "";
      return `<w:r>${bold}<w:t xml:space="preserve">${xml(part.text)}</w:t></w:r>`;
    })
    .join("");
  return `<w:p>${runs}</w:p>`;
}

function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length - 8) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc2) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return { width: 1000, height: 1250 };
}

function imageParagraph(cx, cy) {
  return `<w:p><w:r><w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0">
      <wp:extent cx="${cx}" cy="${cy}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="1" name="Portrait"/>
      <wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>
      <a:graphic>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic>
            <pic:nvPicPr><pic:cNvPr id="1" name="profile.jpg"/><pic:cNvPicPr/></pic:nvPicPr>
            <pic:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
            <pic:spPr>
              <a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing></w:r></w:p>`;
}

function documentXml(blocks) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${blocks.join("")}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="851" w:right="851" w:bottom="851" w:left="851" w:header="0" w:footer="0" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function stylesXml(lang) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
      <w:lang w:val="${xml(lang)}"/>
    </w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="280" w:after="60"/><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:color w:val="153A66"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
  </w:style>
</w:styles>`;
}

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/profile.jpg"/>
</Relationships>`;

const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Portfolio Édouard Bengehya</Application>
</Properties>`;

function blocksFor(model, photoSize) {
  const displayWidth = 72 * 9525;
  const displayHeight = Math.round(displayWidth * (photoSize.height / photoSize.width));
  const phones = model.phones.map((phone) => phone.display).join("  ·  ");
  return [
    imageParagraph(displayWidth, displayHeight),
    paragraph(model.name, "Heading1"),
    paragraph(`${model.ui.civilNameLabel} : ${model.civilName}`),
    paragraph(model.title),
    paragraph(`${model.email}  ·  ${phones}`),
    paragraph(`${model.ui.addressLabel} : ${model.addressLine}`),
    paragraph(`${model.ui.nationality} : ${model.nationality}  ·  ${model.city}`),
    paragraph(model.headings.profile, "Heading2"),
    paragraph(model.quote),
    paragraph(model.educationNote),
    paragraph(model.headings.skills, "Heading2"),
    ...model.skillGroups.map((group) =>
      richParagraph([
        { text: `${group.label}. `, bold: true },
        { text: group.skills.map((skill) => `${skill.name} (${skill.levelLabel})`).join(", ") },
      ]),
    ),
    paragraph(model.headings.experience, "Heading2"),
    ...model.experience.flatMap((item) => {
      const place = [item.company, item.location].filter(Boolean).join(" · ");
      return [
        paragraph(`${item.role} — ${place}`),
        paragraph(item.period),
        paragraph(item.summary),
        ...item.duties.map((duty) => paragraph(`• ${duty}`)),
      ];
    }),
    paragraph(model.headings.education, "Heading2"),
    ...model.education.flatMap((item) => {
      const where = [item.school, item.location].filter(Boolean).join(" · ");
      return [paragraph(item.program), paragraph(`${where} · ${item.period}`), ...(item.detail ? [paragraph(item.detail)] : [])];
    }),
    paragraph(model.headings.certifications, "Heading2"),
    ...model.certifications.flatMap((item) => {
      const issuer = item.issuer || model.ui.issuerUnknown;
      const date = item.date || model.ui.dateUnknown;
      const hours = item.hours ? ` · ${item.hours} ${model.ui.hoursUnit}` : "";
      return [
        paragraph(item.name),
        paragraph(`${item.domain} · ${issuer} · ${date}${hours}`),
        ...(item.note ? [paragraph(item.note)] : []),
      ];
    }),
    paragraph(model.headings.languages, "Heading2"),
    ...model.languages.map((item) => paragraph(`${item.name} — ${item.level}${item.note ? `. ${item.note}` : ""}`)),
    paragraph(model.headings.interests, "Heading2"),
    ...model.interests.map((item) => paragraph(`• ${item}`)),
    paragraph(model.headings.signature, "Heading2"),
    paragraph(model.signature.available ? model.signature.alt : model.ui.signaturePending),
    paragraph(model.signature.name),
  ];
}

const first = buildCvModel(portfolioFor("fr"));
const photo = readFileSync(resolve(root, "public", first.photo.src.replace(/^\//, "")));
const size = jpegSize(photo);

for (const locale of locales) {
  const data = portfolioFor(locale);
  const model = buildCvModel(data);
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>${xml(data.seo.cvTitle)}</dc:title>
  <dc:creator>${xml(model.name)}</dc:creator>
  <dc:description>${xml(data.seo.cvDescription)}</dc:description>
</cp:coreProperties>`;
  const target = resolve(root, "public", model.cvFiles[locale].docx.replace(/^\//, ""));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    createZip([
      { name: "[Content_Types].xml", data: contentTypes },
      { name: "_rels/.rels", data: rels },
      { name: "docProps/core.xml", data: core },
      { name: "docProps/app.xml", data: app },
      { name: "word/document.xml", data: documentXml(blocksFor(model, size)) },
      { name: "word/styles.xml", data: stylesXml(model.docLang) },
      { name: "word/_rels/document.xml.rels", data: documentRels },
      { name: "word/media/profile.jpg", data: photo },
    ]),
  );
  console.log(`DOCX écrit : ${target}`);
}

for (const legacyName of ["cv-edouard-bengehya.docx", "cv-edouard-bengehya.pdf"]) {
  const legacy = resolve(root, "public/cv", legacyName);
  if (existsSync(legacy)) unlinkSync(legacy);
}
