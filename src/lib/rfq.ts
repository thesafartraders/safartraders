export type RfqPayload = {
  requirement: string;
  productCategory?: string;
  quantity: string;
  gradeSpecification?: string;
  applicationUse?: string;
  message?: string;
  destinationPort: string;
  destinationZip?: string;
  destinationCountry: string;
  destinationCountryCode?: string;
  destinationState?: string;
  incoterm?: string;
  shipmentType?: string;
  timeline?: string;
  monthlyRequirement?: string;
  qualityStandards?: string;
  certificates?: string;
  inspectionPreference?: string;
  sampleOrDrawing?: string;
  companyName: string;
  contactPerson: string;
  addressState?: string;
  address?: string;
  addressZip?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  whatsappConsent: boolean;
  privacyConsent: boolean;
};

export type RfqSubmitResponse = {
  ok: boolean;
  error?: string;
  rfqId?: string;
  pdfBase64?: string;
  pdfFileName?: string;
  emailSent?: boolean;
  emailNote?: string;
  whatsappBuyerSent?: boolean;
  whatsappTeamSent?: boolean;
  whatsappManualUrl?: string;
  whatsappNote?: string;
};

export function makeRfqId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ST-RFQ-${stamp}-${suffix}`;
}

export function cleanRfqString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normalizeRfqPayload(body: Partial<RfqPayload>): RfqPayload {
  return {
    requirement: cleanRfqString(body.requirement),
    productCategory: cleanRfqString(body.productCategory),
    quantity: cleanRfqString(body.quantity, 120),
    gradeSpecification: cleanRfqString(body.gradeSpecification, 1000),
    applicationUse: cleanRfqString(body.applicationUse, 1000),
    message: cleanRfqString(body.message, 2000),
    destinationPort: cleanRfqString(body.destinationPort),
    destinationZip: cleanRfqString(body.destinationZip, 80),
    destinationCountry: cleanRfqString(body.destinationCountry, 120),
    destinationCountryCode: cleanRfqString(body.destinationCountryCode, 10),
    destinationState: cleanRfqString(body.destinationState, 120),
    incoterm: cleanRfqString(body.incoterm, 80),
    shipmentType: cleanRfqString(body.shipmentType, 120),
    timeline: cleanRfqString(body.timeline, 160),
    monthlyRequirement: cleanRfqString(body.monthlyRequirement, 160),
    qualityStandards: cleanRfqString(body.qualityStandards, 1000),
    certificates: cleanRfqString(body.certificates, 1000),
    inspectionPreference: cleanRfqString(body.inspectionPreference, 500),
    sampleOrDrawing: cleanRfqString(body.sampleOrDrawing, 1000),
    companyName: cleanRfqString(body.companyName, 200),
    contactPerson: cleanRfqString(body.contactPerson, 160),
    addressState: cleanRfqString(body.addressState, 120),
    address: cleanRfqString(body.address, 1000),
    addressZip: cleanRfqString(body.addressZip, 80),
    email: cleanRfqString(body.email, 200),
    phone: cleanRfqString(body.phone, 100),
    whatsapp: cleanRfqString(body.whatsapp, 100),
    whatsappConsent: body.whatsappConsent === true,
    privacyConsent: body.privacyConsent === true,
  };
}

export function isHighPriority(quantity?: string, monthlyRequirement?: string) {
  const qty = `${quantity || ""} ${monthlyRequirement || ""}`.toLowerCase();
  const mtMatch = qty.match(/(\d{2,})\s*mt/);
  return Boolean((mtMatch && Number(mtMatch[1]) >= 100) || /container|monthly|recurring|fcl/.test(qty));
}

export function rfqMissingFields(rfq: RfqPayload) {
  const missing: string[] = [];
  if (!rfq.requirement) missing.push("requirement");
  if (!rfq.quantity) missing.push("quantity");
  if (!rfq.destinationPort) missing.push("destinationPort");
  if (!rfq.destinationCountry) missing.push("destinationCountry");
  if (!rfq.companyName) missing.push("companyName");
  if (!rfq.contactPerson) missing.push("contactPerson");
  if (!rfq.phone) missing.push("phone");
  if (!rfq.privacyConsent) missing.push("privacyConsent");
  return missing;
}

export function rfqToMessage(rfq: RfqPayload) {
  return [
    rfq.productCategory && `Product category: ${rfq.productCategory}`,
    rfq.gradeSpecification && `Grade/specification: ${rfq.gradeSpecification}`,
    rfq.applicationUse && `Application/use case: ${rfq.applicationUse}`,
    rfq.message && `Additional requirement details: ${rfq.message}`,
    rfq.destinationState && `Destination state/province: ${rfq.destinationState}`,
    rfq.destinationZip && `Destination ZIP/PIN: ${rfq.destinationZip}`,
    rfq.incoterm && `Incoterm preference: ${rfq.incoterm}`,
    rfq.shipmentType && `Shipment type: ${rfq.shipmentType}`,
    rfq.monthlyRequirement && `Recurring/monthly requirement: ${rfq.monthlyRequirement}`,
    rfq.qualityStandards && `Quality standards: ${rfq.qualityStandards}`,
    rfq.certificates && `Certificates/documents: ${rfq.certificates}`,
    rfq.inspectionPreference && `Inspection preference: ${rfq.inspectionPreference}`,
    rfq.sampleOrDrawing && `Sample/drawing/reference: ${rfq.sampleOrDrawing}`,
    rfq.addressState && `Company state/province: ${rfq.addressState}`,
    rfq.address && `Company address: ${rfq.address}`,
    rfq.addressZip && `Company ZIP/PIN: ${rfq.addressZip}`,
    rfq.whatsapp && `WhatsApp: ${rfq.whatsapp}`,
    `WhatsApp consent: ${rfq.whatsappConsent ? "Yes" : "No"}`,
    `Privacy-policy consent: ${rfq.privacyConsent ? "Yes" : "No"}`,
  ].filter(Boolean).join("\n");
}
