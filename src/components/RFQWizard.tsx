"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2, X, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { productCategories } from "@/lib/products";
import { Country, State } from "country-state-city";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import type { Value as PhoneValue } from "react-phone-number-input";
import type { RfqSubmitResponse } from "@/lib/rfq";
import "react-phone-number-input/style.css";

// ── Static data ────────────────────────────────────────────────────────────────

const PRODUCT_SUGGESTIONS = [
  "20 MT Raw Materials",
  "2 Containers",
  "Monthly Supply",
  "Industrial Equipment",
  "Metal Products",
  "Construction Materials",
  "Other industrial requirement",
];

// Map category shortTitle → product examples drawn from subcategory examples
const CATEGORY_PRODUCT_SUGGESTIONS: Record<string, string[]> = {
  "Swimming Pool Solutions": [
    "Swimming pool chemicals", "Pool filtration system", "Pool circulation pump",
    "Pool cleaning equipment", "Pool lighting", "Pool heating equipment",
    "Pool safety equipment", "Pool accessories",
  ],
  "Metals & Alloys": [
    "Mild steel sheets", "Structural steel sections", "HR/CR coils", "Steel plates",
    "Aluminium ingots", "Aluminium sheets", "Aluminium extrusions", "Aluminium coils",
    "Copper cathodes", "Copper rods", "Copper wire bars",
    "Brass rods", "Brass sheets", "Brass fittings",
    "SS 304 sheets", "SS 316 coils", "SS pipes and tubes",
    "Zinc ingots", "Lead ingots", "Nickel 200 rounds", "Inconel plates", "Monel rods",
  ],
  "Industrial Scrap": [
    "HMS 1 & 2", "Zorba", "Aluminium scrap", "Copper scrap", "Brass scrap",
    "Cast iron scrap", "Stainless steel scrap",
    "PET bottle scrap", "HDPE scrap", "PP regrind", "PVC scrap", "ABS regrind",
    "OCC (Old Corrugated Cartons)", "ONP (Old Newsprint)", "Cardboard bales",
    "Tyre scrap (TDF)", "Rubber crumb feedstock", "EPDM scrap",
    "PCB boards", "Motherboards", "Cable wire scrap",
  ],
  "Machinery & Equipment": [
    "CNC machines", "Hydraulic press machines", "Lathe machines", "Milling machines",
    "Press brakes", "Injection moulding machines", "Cutting machines",
    "Mixing equipment", "Dryers", "Conveyors", "Compressors", "Air handling units",
    "Carbide cutting tools", "Press dies", "Jigs and fixtures", "Industrial drill bits",
    "Excavators", "Forklifts", "Cranes", "Generators", "Diesel engines",
    "PLCs", "Servo motors", "Conveyor systems", "Robotic arms", "VFDs",
  ],
  "Construction Materials": [
    "Black Galaxy granite slabs", "Absolute Black granite", "Kashmir White granite",
    "Granite tiles", "Granite kerbs",
    "Makrana white marble", "Marble tiles", "Marble flooring slabs",
    "Sandstone cladding", "Slate tiles", "Limestone blocks", "Cobblestones",
    "Vitrified floor tiles", "Porcelain tiles", "Wall tiles", "Mosaic tiles",
    "Cement bags", "TMT steel bars", "AAC blocks", "PVC pipes", "Plywood sheets",
  ],
  "Industrial Raw Materials": [
    "HDPE granules", "PP granules", "PVC resin", "Polystyrene",
    "Caustic soda", "Soda ash", "Sulphuric acid", "Industrial salts",
    "Iron ore fines", "Limestone powder", "Silica sand", "Bentonite",
    "Gypsum", "Coal (non-coking)", "Furnace coke", "Minerals",
    "Carbon black", "Titanium dioxide",
  ],
  "Engineering Components": [
    "Mild steel fasteners", "Stainless steel bolts and nuts", "Hex bolts",
    "Anchor bolts", "Threaded rods",
    "Mechanical seals", "Bearings", "Gears", "Shafts", "Couplings",
    "Steel fabricated frames", "Pressure vessels", "Industrial valves",
    "Pipes and fittings", "Flanges",
    "Industrial hardware", "Springs", "Bushings",
  ],
  "Packaging & Supplies": [
    "BOPP bags", "Woven PP bags", "Jute bags",
    "Carton boxes", "Corrugated packaging", "Kraft paper rolls",
    "Plastic film rolls", "Stretch wrap", "Shrink wrap",
    "Industrial packing materials", "Bulk bags (FIBC)", "Pallet wrap",
    "Packaging tapes", "Foam padding", "Bubble wrap rolls",
  ],
  "Custom Sourcing": [
    "Buyer-led procurement requirement",
    "Non-standard product request",
    "Supplier identification and verification",
    "Domestic and export supply support",
    "Commercial supply requirement",
    "Procurement coordination",
  ],
};

const MIDDLE_EAST_ISO = ["AE", "SA", "QA", "OM", "KW", "BH", "JO", "IQ", "YE", "SY", "LB", "PS"];

const ME_PORTS = [
  "Jebel Ali Port, UAE",
  "Khalifa Port, UAE",
  "Port of Dubai, UAE",
  "Port of Dammam, Saudi Arabia",
  "Port of Jeddah, Saudi Arabia",
  "Port of Hamad, Qatar",
  "Port Sultan Qaboos, Oman",
  "Port of Shuaiba, Kuwait",
  "Khalifa Bin Salman Port, Bahrain",
  "Aqaba Port, Jordan",
  "Um Qasr Port, Iraq",
];

const OTHER_PORTS = [
  "Port of Mumbai, India",
  "Nhava Sheva (JNPT), India",
  "Port of Chennai, India",
  "Port Klang, Malaysia",
  "Port of Singapore",
  "Port of Rotterdam, Netherlands",
  "Port of Hamburg, Germany",
  "Port of Antwerp, Belgium",
  "Port of Shanghai, China",
  "Port of Busan, South Korea",
  "Port of Colombo, Sri Lanka",
  "Port of Karachi, Pakistan",
  "Port of Mombasa, Kenya",
  "Port of Lagos, Nigeria",
  "Port of Durban, South Africa",
  "Port of Alexandria, Egypt",
  "Port of New York, USA",
  "Port of Los Angeles, USA",
  "Port of Felixstowe, UK",
];

const ALL_PORTS = [...ME_PORTS, ...OTHER_PORTS];

const PORT_DESTINATIONS = [
  { match: ["jebel ali"], countryCode: "AE", state: "Dubai" },
  { match: ["khalifa port"], countryCode: "AE", state: "Abu Dhabi Emirate" },
  { match: ["port of dubai", "dubai"], countryCode: "AE", state: "Dubai" },
  { match: ["dammam"], countryCode: "SA", state: "Eastern Province" },
  { match: ["jeddah"], countryCode: "SA", state: "Makkah" },
  { match: ["hamad"], countryCode: "QA", state: "Doha" },
  { match: ["sultan qaboos"], countryCode: "OM", state: "Muscat Governorate" },
  { match: ["shuaiba"], countryCode: "KW", state: "Al Ahmadi Governorate" },
  { match: ["khalifa bin salman"], countryCode: "BH", state: "Muharraq Governorate" },
  { match: ["aqaba"], countryCode: "JO", state: "Aqaba Governorate" },
  { match: ["um qasr"], countryCode: "IQ", state: "Basra Governorate" },
  { match: ["mumbai"], countryCode: "IN", state: "Maharashtra" },
  { match: ["nhava sheva", "jnpt"], countryCode: "IN", state: "Maharashtra" },
  { match: ["chennai"], countryCode: "IN", state: "Tamil Nadu" },
  { match: ["port klang"], countryCode: "MY", state: "Selangor" },
  { match: ["singapore"], countryCode: "SG", state: "" },
  { match: ["rotterdam"], countryCode: "NL", state: "South Holland" },
  { match: ["hamburg"], countryCode: "DE", state: "Hamburg" },
  { match: ["antwerp"], countryCode: "BE", state: "Flanders" },
  { match: ["shanghai"], countryCode: "CN", state: "Shanghai" },
  { match: ["busan"], countryCode: "KR", state: "Busan" },
  { match: ["colombo"], countryCode: "LK", state: "Western Province" },
  { match: ["karachi"], countryCode: "PK", state: "Sindh" },
  { match: ["mombasa"], countryCode: "KE", state: "Mombasa" },
  { match: ["lagos"], countryCode: "NG", state: "Lagos" },
  { match: ["durban"], countryCode: "ZA", state: "KwaZulu-Natal" },
  { match: ["alexandria"], countryCode: "EG", state: "Alexandria" },
  { match: ["new york"], countryCode: "US", state: "New York" },
  { match: ["los angeles"], countryCode: "US", state: "California" },
  { match: ["felixstowe"], countryCode: "GB", state: "England" },
];

const ZIP_DESTINATIONS = [
  { match: /^400|^410|^421/, countryCode: "IN", state: "Maharashtra" },
  { match: /^600|^601|^602|^603/, countryCode: "IN", state: "Tamil Nadu" },
  { match: /^322|^324|^343/, countryCode: "SA", state: "Eastern Province" },
  { match: /^21/, countryCode: "SA", state: "Makkah" },
  { match: /^1[0-9]{4}$/, countryCode: "KW", state: "Capital Governorate" },
];

const COMPANY_SUGGESTIONS = [
  "Manufacturing Company",
  "Trading Company",
  "Procurement Company",
  "Construction Company",
  "Industrial Supplier",
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  requirement: string;
  productCategory: string;
  quantity: string;
  gradeSpecification: string;
  applicationUse: string;
  // Step 2
  destinationPort: string;
  destinationCountry: string;
  destinationCountryCode: string;
  destinationState: string;
  destinationZip: string;
  destinationManual: boolean;
  // Step 3
  incoterm: string;
  shipmentType: string;
  timeline: string;
  monthlyRequirement: string;
  // Step 4
  qualityStandards: string;
  certificates: string;
  inspectionPreference: string;
  sampleOrDrawing: string;
  // Step 5
  companyName: string;
  contactPerson: string;
  addressState: string;
  address: string;
  addressZip: string;
  email: string;
  phone: PhoneValue | undefined;
  whatsapp: PhoneValue | undefined;
  whatsappConsent: boolean;
  privacyConsent: boolean;
  message: string;
}

const INITIAL: FormData = {
  requirement: "",
  productCategory: "",
  quantity: "",
  gradeSpecification: "",
  applicationUse: "",
  destinationPort: "",
  destinationCountry: "",
  destinationCountryCode: "",
  destinationState: "",
  destinationZip: "",
  destinationManual: false,
  incoterm: "",
  shipmentType: "",
  timeline: "",
  monthlyRequirement: "",
  qualityStandards: "",
  certificates: "",
  inspectionPreference: "",
  sampleOrDrawing: "",
  companyName: "",
  contactPerson: "",
  addressState: "",
  address: "",
  addressZip: "",
  email: "",
  phone: undefined,
  whatsapp: undefined,
  whatsappConsent: false,
  privacyConsent: false,
  message: "",
};

const STEPS = ["Requirement", "Destination", "Trade", "Quality", "Contact", "Review"];

// ── Reusable sub-components ────────────────────────────────────────────────────

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.length > 0
    ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : suggestions.slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        style={inputStyle}
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={dropdownStyle}
          >
            {filtered.map((s) => (
              <li
                key={s}
                style={dropdownItemStyle}
                onMouseDown={() => { onChange(s); setOpen(false); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-bg-secondary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string, code?: string) => void;
  options: { label: string; value: string; code?: string }[];
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const allFiltered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );
  const filtered = allFiltered.slice(0, 50);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <label style={labelStyle}>{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ ...inputStyle, textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span style={{ color: selected ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>
          {selected ? selected.label : placeholder}
        </span>
        <Search size={15} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{ ...dropdownStyle, padding: 0 }}
          >
            <div style={{ padding: "8px" }}>
              <input
                style={{ ...inputStyle, marginBottom: 0, fontSize: "13px", padding: "6px 10px" }}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <ul style={{ maxHeight: "200px", overflowY: "auto", margin: 0, padding: "0 0 4px" }}>
              {filtered.map((o) => (
                <li
                  key={o.value}
                  style={dropdownItemStyle}
                  onMouseDown={() => { onChange(o.value, o.code); setOpen(false); setQuery(""); }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-bg-secondary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {o.label}
                </li>
              ))}
              {filtered.length === 0 && (
                <li style={{ ...dropdownItemStyle, color: "var(--color-text-tertiary)", fontSize: "13px" }}>No results</li>
              )}
              {allFiltered.length > 50 && (
                <li style={{ ...dropdownItemStyle, color: "var(--color-text-tertiary)", fontSize: "12px", cursor: "default" }}>
                  Keep typing to narrow results ({allFiltered.length} matches)
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "48px",
  background: "#fff",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "var(--color-text-primary)",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 750,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-text-tertiary)",
  marginBottom: "6px",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  background: "#fff",
  border: "1px solid var(--color-border-light)",
  borderRadius: "12px",
  zIndex: 80,
  overflow: "hidden",
  boxShadow: "0 18px 48px rgba(17,19,21,0.14)",
};

const dropdownItemStyle: React.CSSProperties = {
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "14px",
  color: "var(--color-text-primary)",
  listStyle: "none",
  transition: "background 0.1s",
};

// ── Country / State helpers ────────────────────────────────────────────────────

function buildCountryOptions() {
  const all = Country.getAllCountries();
  const me = all.filter((c) => MIDDLE_EAST_ISO.includes(c.isoCode));
  const rest = all.filter((c) => !MIDDLE_EAST_ISO.includes(c.isoCode));
  return [
    ...me.map((c) => ({ label: `${c.flag} ${c.name}`, value: c.name, code: c.isoCode })),
    ...rest.map((c) => ({ label: `${c.flag} ${c.name}`, value: c.name, code: c.isoCode })),
  ];
}

const COUNTRY_OPTIONS = buildCountryOptions();

function buildStateOptions(isoCode: string) {
  const states = State.getStatesOfCountry(isoCode);
  return states.map((s) => ({ label: s.name, value: s.name, code: s.isoCode }));
}

function countryNameFromCode(countryCode: string) {
  return Country.getAllCountries().find((c) => c.isoCode === countryCode)?.name || "";
}

function inferDestination(destinationPort: string, zip: string) {
  const normalizedPort = destinationPort.toLowerCase();
  const zipDigits = zip.replace(/\D/g, "");
  const portMatch = PORT_DESTINATIONS.find((item) =>
    item.match.some((term) => normalizedPort.includes(term))
  );
  const zipMatch = zipDigits
    ? ZIP_DESTINATIONS.find((item) => item.match.test(zipDigits))
    : undefined;
  const match = portMatch || zipMatch;
  if (!match) return null;

  const country = countryNameFromCode(match.countryCode);
  if (!country) return null;

  const stateExists = State.getStatesOfCountry(match.countryCode).some((s) => s.name === match.state);
  return {
    country,
    countryCode: match.countryCode,
    state: stateExists ? match.state : "",
  };
}

// ── Step components ────────────────────────────────────────────────────────────

function Step1({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
}) {
  // Pick suggestions based on selected category; fall back to generic list
  const requirementSuggestions =
    data.productCategory && CATEGORY_PRODUCT_SUGGESTIONS[data.productCategory]
      ? CATEGORY_PRODUCT_SUGGESTIONS[data.productCategory]
      : PRODUCT_SUGGESTIONS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          What do you need us to source?
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          Share the product, quantity, and use case. No pricing is promised before feasibility review.
        </p>
      </div>
      <AutocompleteInput
        value={data.productCategory}
        onChange={(v) => set("productCategory", v)}
        suggestions={productCategories.map((c) => c.shortTitle)}
        placeholder="e.g. Metals & Alloys"
        label="Product Category (optional)"
      />
      <AutocompleteInput
        value={data.requirement}
        onChange={(v) => set("requirement", v)}
        suggestions={requirementSuggestions}
        placeholder={data.productCategory ? `e.g. ${requirementSuggestions[0] ?? "Specify your product"}` : "e.g. Steel Scrap, Industrial Equipment, HDPE Granules"}
        label="Product / Requirement *"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <div>
          <label style={labelStyle}>Quantity *</label>
          <input
            style={inputStyle}
            placeholder="e.g. 25 MT, 2 x 40ft FCL"
            value={data.quantity}
            onChange={(e) => set("quantity", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Grade / Specification (optional)</label>
          <input
            style={inputStyle}
            placeholder="e.g. IS 2062 E250, 304, MFI 2.0"
            value={data.gradeSpecification}
            onChange={(e) => set("gradeSpecification", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Application / Use Case (optional)</label>
        <input
          style={inputStyle}
          placeholder="Where or how will this product be used?"
          value={data.applicationUse}
          onChange={(e) => set("applicationUse", e.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>Additional Details (optional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
          placeholder="Quantity, specifications, delivery timeline…"
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>
    </div>
  );
}

function Step2({
  data,
  set,
  setBool,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  setBool: (k: keyof FormData, v: boolean) => void;
}) {
  const countryOptions = COUNTRY_OPTIONS;
  const stateOptions = useMemo(() => data.destinationCountryCode ? buildStateOptions(data.destinationCountryCode) : [], [data.destinationCountryCode]);
  const hasStates = stateOptions.length > 0;
  const autoFilled = Boolean(inferDestination(data.destinationPort, data.destinationZip)) && !data.destinationManual;

  function applyDestination(value: string, zip = data.destinationZip) {
    set("destinationPort", value);
    const inferred = inferDestination(value, zip);
    if (!inferred || data.destinationManual) return;
    set("destinationCountry", inferred.country);
    set("destinationCountryCode", inferred.countryCode);
    set("destinationState", inferred.state);
  }

  function applyZip(zip: string) {
    set("destinationZip", zip);
    const inferred = inferDestination(data.destinationPort, zip);
    if (!inferred || data.destinationManual) return;
    set("destinationCountry", inferred.country);
    set("destinationCountryCode", inferred.countryCode);
    set("destinationState", inferred.state);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          Where are you shipping to?
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          Enter the destination port and ZIP / PIN. Country and state can be auto-filled; your manual selection is preserved.
        </p>
      </div>
      <AutocompleteInput
        value={data.destinationPort}
        onChange={applyDestination}
        suggestions={ALL_PORTS}
        placeholder="e.g. Jebel Ali Port, UAE"
        label="Destination Port *"
      />
      <div>
        <label style={labelStyle}>ZIP / PIN Code</label>
        <input
          style={inputStyle}
          placeholder="ZIP / PIN"
          value={data.destinationZip}
          onChange={(e) => applyZip(e.target.value)}
        />
      </div>
      {autoFilled && (
        <p style={{ margin: "-4px 0 0", color: "var(--color-accent)", fontSize: "13px", fontWeight: 650 }}>
          Destination details auto-filled from the port (or ZIP when no port matches). Selecting a country or state keeps your choice.
        </p>
      )}
      <SearchableSelect
        label="Country"
        value={data.destinationCountry}
        placeholder="Auto-filled from port / ZIP where possible"
        options={countryOptions}
        onChange={(v, code) => {
          set("destinationCountry", v);
          set("destinationCountryCode", code || "");
          set("destinationState", "");
          setBool("destinationManual", true);
        }}
      />
      {hasStates ? (
        <SearchableSelect
          label="State / Province"
          value={data.destinationState}
          placeholder="Auto-filled from port / ZIP where possible"
          options={stateOptions}
          onChange={(v) => { set("destinationState", v); setBool("destinationManual", true); }}
        />
      ) : data.destinationCountry ? (
        <div>
          <label style={labelStyle}>State / Province</label>
          <input
            style={inputStyle}
            placeholder="State / Province"
            value={data.destinationState}
            onChange={(e) => { set("destinationState", e.target.value); setBool("destinationManual", true); }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Step3({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          Trade and shipment details
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          These details help us prepare a realistic sourcing route before pricing.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <div>
          <label style={labelStyle}>Incoterm Preference (optional)</label>
          <select
            style={inputStyle}
            value={data.incoterm}
            onChange={(e) => set("incoterm", e.target.value)}
          >
            <option value="">Not sure yet</option>
            <option value="FOB">FOB</option>
            <option value="CIF">CIF</option>
            <option value="CFR">CFR</option>
            <option value="EXW">EXW</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Shipment Type (optional)</label>
          <select
            style={inputStyle}
            value={data.shipmentType}
            onChange={(e) => set("shipmentType", e.target.value)}
          >
            <option value="">Not sure yet</option>
            <option value="20ft FCL">20ft FCL</option>
            <option value="40ft FCL">40ft FCL</option>
            <option value="LCL">LCL</option>
            <option value="Air Freight">Air Freight</option>
            <option value="Break Bulk / Flat Rack">Break Bulk / Flat Rack</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Timeline (optional)</label>
        <input
          style={inputStyle}
          placeholder="e.g. Within 30 days, urgent, Q3 procurement"
          value={data.timeline}
          onChange={(e) => set("timeline", e.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>Recurring / Monthly Requirement (optional)</label>
        <input
          style={inputStyle}
          placeholder="e.g. Monthly supply, quarterly order, trial order"
          value={data.monthlyRequirement}
          onChange={(e) => set("monthlyRequirement", e.target.value)}
        />
      </div>
      <p style={{ margin: 0, color: "var(--color-text-tertiary)", fontSize: "13px", lineHeight: 1.6 }}>
        Almost done. The next step helps prevent wrong items, wrong grades, and avoidable quality mismatch.
      </p>
    </div>
  );
}

function Step4({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          Quality and R&amp;D review
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          Share standards, certificates, or inspection expectations so we can avoid unsuitable products.
        </p>
      </div>
      <div>
        <label style={labelStyle}>Standards / Quality Expectations (optional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "86px", resize: "vertical" }}
          placeholder="e.g. ASTM, ISO, mill test certificate, food-grade not required, tolerance details"
          value={data.qualityStandards}
          onChange={(e) => set("qualityStandards", e.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>Certificates / Documents Needed (optional)</label>
        <input
          style={inputStyle}
          placeholder="e.g. COA, MTC, Certificate of Origin, inspection report"
          value={data.certificates}
          onChange={(e) => set("certificates", e.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>Inspection Preference (optional)</label>
        <select
          style={inputStyle}
          value={data.inspectionPreference}
          onChange={(e) => set("inspectionPreference", e.target.value)}
        >
          <option value="">Not sure yet</option>
          <option value="Supplier inspection report">Supplier inspection report</option>
          <option value="Third-party pre-shipment inspection">Third-party pre-shipment inspection</option>
          <option value="Loading photos and documents">Loading photos and documents</option>
          <option value="Sample approval before order">Sample approval before order</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Sample / Drawing / Reference (optional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "78px", resize: "vertical" }}
          placeholder="Mention drawing, sample, part number, brand reference, or upload link if available."
          value={data.sampleOrDrawing}
          onChange={(e) => set("sampleOrDrawing", e.target.value)}
        />
      </div>
    </div>
  );
}

function Step5({
  data,
  set,
  setBool,
  setPhone,
  setWhatsapp,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  setBool: (k: keyof FormData, v: boolean) => void;
  setPhone: (v: PhoneValue | undefined) => void;
  setWhatsapp: (v: PhoneValue | undefined) => void;
}) {
  const defaultCountry = (data.destinationCountryCode || "IN") as import("react-phone-number-input").Country;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          Company and contact details
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          We&apos;ll generate the RFQ summary PDF. Phone is required; email is optional.
        </p>
      </div>
      <AutocompleteInput
        value={data.companyName}
        onChange={(v) => set("companyName", v)}
        suggestions={COMPANY_SUGGESTIONS}
        placeholder="e.g. Emirates Steel…"
        label="Company Name *"
      />
      <div>
        <label style={labelStyle}>Contact Person *</label>
        <input
          style={inputStyle}
          placeholder="Your full name"
          value={data.contactPerson}
          onChange={(e) => set("contactPerson", e.target.value)}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <div>
          <label style={labelStyle}>Phone Number *</label>
          <div style={phoneWrapStyle}>
            <PhoneInput
              international
              defaultCountry={defaultCountry}
              value={data.phone}
              onChange={setPhone}
              placeholder="Phone number"
              countrySelectProps={{ unicodeFlags: true }}
            />
          </div>
          {data.phone && !isPossiblePhoneNumber(data.phone) && (
            <p role="alert" style={{ color: "#b42318", fontSize: "12px", margin: "6px 0 0" }}>Enter a complete phone number.</p>
          )}
        </div>
        <div>
          <label style={labelStyle}>WhatsApp Number</label>
          <div style={phoneWrapStyle}>
            <PhoneInput
              international
              defaultCountry={defaultCountry}
              value={data.whatsapp}
              onChange={setWhatsapp}
              placeholder="WhatsApp number"
              countrySelectProps={{ unicodeFlags: true }}
            />
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Address (optional)</label>
        <input
          style={inputStyle}
          placeholder="Street address"
          value={data.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>Email Address (optional)</label>
        <input
          style={inputStyle}
          type="email"
          placeholder="you@company.com"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && (
          <p role="alert" style={{ color: "#b42318", fontSize: "12px", margin: "6px 0 0" }}>Enter a valid email address or leave this field blank.</p>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <div>
          <label style={labelStyle}>State / Province (optional)</label>
          <input
            style={inputStyle}
            placeholder="State / Province"
            value={data.addressState}
            onChange={(e) => set("addressState", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>ZIP / PIN Code (optional)</label>
          <input
            style={inputStyle}
            placeholder="ZIP / PIN"
            value={data.addressZip}
            onChange={(e) => set("addressZip", e.target.value)}
          />
        </div>
      </div>
      <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.55, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={data.whatsappConsent}
          onChange={(e) => setBool("whatsappConsent", e.target.checked)}
          style={{ marginTop: "3px", width: "16px", height: "16px" }}
        />
        Send the RFQ summary PDF and status updates on WhatsApp. If automatic delivery isn&apos;t available, I&apos;ll share the PDF manually.
      </label>
      <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.55, cursor: "pointer" }}>
        <input type="checkbox" checked={data.privacyConsent} onChange={(e) => setBool("privacyConsent", e.target.checked)} style={{ marginTop: "3px", width: "16px", height: "16px" }} />
        <span>I agree to the processing and sharing of my RFQ details as described in the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>, including email delivery and, where selected, WhatsApp delivery.</span>
      </label>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | boolean }) {
  if (value === undefined || value === "") return null;
  return (
    <div className="rfq-review-row" style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--color-border-light)" }}>
      <span className="rfq-review-label" style={{ color: "var(--color-text-tertiary)", fontSize: "12px", fontWeight: 750, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <span className="rfq-review-value" style={{ color: "var(--color-text-primary)", fontSize: "14px", lineHeight: 1.55, overflowWrap: "anywhere" }}>{String(value)}</span>
    </div>
  );
}

function Step6({ data }: { data: FormData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 720, color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "-0.015em" }}>
          Review your RFQ
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
          Confirm the details before we generate the RFQ Summary PDF. This is not a price quotation.
        </p>
      </div>
      <div className="rfq-review-card" style={{ border: "1px solid var(--color-border-light)", borderRadius: "14px", background: "#fff", padding: "10px 18px" }}>
        <ReviewRow label="Requirement" value={data.requirement} />
        <ReviewRow label="Category" value={data.productCategory} />
        <ReviewRow label="Quantity" value={data.quantity} />
        <ReviewRow label="Specification" value={data.gradeSpecification} />
        <ReviewRow label="Use Case" value={data.applicationUse} />
        <ReviewRow label="Destination" value={[data.destinationPort, data.destinationState, data.destinationCountry, data.destinationZip].filter(Boolean).join(", ")} />
        <ReviewRow label="Trade" value={[data.incoterm, data.shipmentType, data.timeline, data.monthlyRequirement].filter(Boolean).join(" | ")} />
        <ReviewRow label="Quality" value={[data.qualityStandards, data.certificates, data.inspectionPreference, data.sampleOrDrawing].filter(Boolean).join(" | ")} />
        <ReviewRow label="Company" value={data.companyName} />
        <ReviewRow label="Contact" value={[data.contactPerson, data.email, data.phone?.toString()].filter(Boolean).join(" | ")} />
        <ReviewRow label="WhatsApp" value={[data.whatsapp?.toString(), data.whatsappConsent ? "Consent given" : "Manual/email only"].filter(Boolean).join(" | ")} />
      </div>
      <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
        After submission, the RFQ summary PDF downloads automatically. Where WhatsApp delivery is available, we send it there too; otherwise a manual share link is provided.
      </p>
    </div>
  );
}

const phoneWrapStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  padding: "10px 14px",
  color: "var(--color-text-primary)",
};

// ── Main RFQWizard component ───────────────────────────────────────────────────

export default function RFQWizard({ onClose }: { onClose: () => void }) {
  const [draft] = useState(() => {
    if (typeof window === "undefined") return { data: INITIAL, step: 0 };
    const saved = sessionStorage.getItem("safar-rfq-draft");
    if (!saved) return { data: INITIAL, step: 0 };
    try {
      const parsed = JSON.parse(saved) as { data?: FormData; step?: number };
      return {
        data: parsed.data ? { ...INITIAL, ...parsed.data } : INITIAL,
        step: typeof parsed.step === "number" ? Math.max(0, Math.min(STEPS.length - 1, parsed.step)) : 0,
      };
    } catch {
      sessionStorage.removeItem("safar-rfq-draft");
      return { data: INITIAL, step: 0 };
    }
  });
  const [step, setStep] = useState(draft.step);
  const [data, setData] = useState<FormData>(draft.data);
  const formStartedAt = useRef(0);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<RfqSubmitResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { formStartedAt.current = Date.now(); }, []);

  useEffect(() => {
    if (!submitted) sessionStorage.setItem("safar-rfq-draft", JSON.stringify({ data, step }));
  }, [data, step, submitted]);

  function set(k: keyof FormData, v: string) {
    setData((prev) => ({ ...prev, [k]: v }));
  }
  function setBool(k: keyof FormData, v: boolean) {
    setData((prev) => ({ ...prev, [k]: v }));
  }
  function setPhone(v: PhoneValue | undefined) { setData((prev) => ({ ...prev, phone: v })); }
  function setWhatsapp(v: PhoneValue | undefined) { setData((prev) => ({ ...prev, whatsapp: v })); }

  useEffect(() => {
    if (!submitted || !submitResult?.pdfBase64) return;

    const binary = atob(submitResult.pdfBase64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = submitResult.pdfFileName || "Safar-Traders-RFQ-Summary.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    const cleanup = window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    return () => window.clearTimeout(cleanup);
  }, [submitted, submitResult]);

  function canNext() {
    if (step === 0) return data.requirement.trim().length > 0 && data.quantity.trim().length > 0;
    if (step === 1) return data.destinationPort.trim().length > 0 && data.destinationCountry.trim().length > 0;
    if (step === 4) return data.companyName.trim().length > 0 && data.contactPerson.trim().length > 0 && !!data.phone && data.privacyConsent && isPossiblePhoneNumber(data.phone) && (!data.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email));
    return true;
  }

  function nextRequirementMessage() {
    if (step === 0 && !data.requirement.trim()) return "Enter the product or requirement to continue.";
    if (step === 0 && !data.quantity.trim()) return "Enter the quantity to continue.";
    if (step === 1 && !data.destinationPort.trim()) return "Enter the destination port to continue.";
    if (step === 1 && !data.destinationCountry.trim()) return "Select the destination country to continue.";
    if (step === 4 && !data.companyName.trim()) return "Enter your company name to continue.";
    if (step === 4 && !data.contactPerson.trim()) return "Enter a contact person to continue.";
    if (step === 4 && (!data.phone || !isPossiblePhoneNumber(data.phone))) return "Enter a complete, valid phone number to continue.";
    if (step === 4 && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Correct the email address or leave it blank to continue.";
    return "";
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/rfq/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: data.email,
          phone: data.phone?.toString() || "",
          whatsapp: data.whatsapp?.toString() || "",
          website,
          formStartedAt: formStartedAt.current,
        }),
      });
      const result = (await res.json()) as RfqSubmitResponse;
      if (!res.ok || !result.ok) throw new Error(result.error || "Server error");
      setSubmitResult(result);
      setSubmitted(true);
      sessionStorage.removeItem("safar-rfq-draft");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      className="rfq-wizard-shell"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        maxWidth: "none",
        height: "100svh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: 0,
        borderRadius: 0,
        overflow: "hidden",
        boxShadow: "none",
        maxHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }} />
      {/* Header */}
      <div className="rfq-wizard-header" style={{
        padding: "20px clamp(18px, 4vw, 56px) 16px",
        borderBottom: "1px solid var(--color-border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        flexShrink: 0,
      }}>
        <div style={{ width: "100%", maxWidth: "980px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 0, paddingTop: "2px" }}>
            <div className="rfq-mobile-progress" aria-hidden="true">
              <div>
                <span>{submitted ? "Complete" : `Step ${step + 1} of ${STEPS.length}`}</span>
                <strong>{submitted ? "RFQ submitted" : STEPS[step]}</strong>
              </div>
              <div className="rfq-mobile-progress-track">
                <motion.div
                  className="rfq-mobile-progress-fill"
                  animate={{ width: submitted ? "100%" : `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <div className="rfq-desktop-progress">
            <div className="rfq-step-rail" style={{
              position: "absolute",
              left: "calc(100% / 12)",
              right: "calc(100% / 12)",
              top: "20px",
              height: "3px",
              borderRadius: "999px",
              background: "var(--color-border-light)",
            }} />
            <motion.div
              className="rfq-step-rail-progress"
              style={{
                position: "absolute",
                left: "calc(100% / 12)",
                top: "20px",
                height: "3px",
                borderRadius: "999px",
                background: "var(--color-accent)",
              }}
              animate={{ width: `calc(${(step / (STEPS.length - 1)) * 100}% * 5 / 6)` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`, alignItems: "start", position: "relative", zIndex: 1 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "grid", justifyItems: "center", gap: "7px", minWidth: 0 }}>
                  <div className="rfq-step-dot" style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: i < step ? "var(--color-accent)" : i === step ? "var(--color-accent)" : "var(--color-bg-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "3px solid #fff",
                    fontSize: "14px", fontWeight: 800, color: i <= step ? "#fff" : "var(--color-text-tertiary)",
                    transition: "all 0.3s",
                    flexShrink: 0,
                    boxShadow: "0 0 0 1px var(--color-border-light)",
                  }}>
                    {i < step ? <Check size={18} strokeWidth={2.4} /> : i + 1}
                  </div>
                  <span className="rfq-step-label" style={{
                    color: i <= step ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                    fontSize: "12px",
                    fontWeight: 750,
                    letterSpacing: "0.02em",
                    lineHeight: 1.25,
                    textAlign: "center",
                    maxWidth: "92px",
                    overflowWrap: "anywhere",
                  }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>
        <button
          type="button"
          onClick={() => {
            if (!submitted && step > 0 && !window.confirm("Discard your RFQ draft?")) return;
            onClose();
          }}
          aria-label="Close RFQ"
          style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)", borderRadius: "999px", cursor: "pointer", color: "var(--color-text-secondary)", padding: "8px", width: "42px", height: "42px", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <X size={20} />
        </button>
        </div>
      </div>

      {/* Body */}
      <div className={`rfq-wizard-scroll ${submitted ? "is-submitted" : ""}`} style={{ padding: "clamp(22px, 5vw, 56px)", overflowY: "auto", flex: "1 1 0", minHeight: 0, WebkitOverflowScrolling: "touch", paddingBottom: submitted ? "clamp(28px, 6vw, 64px)" : "120px", overscrollBehavior: "contain" }}>
        <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}>
        {submitted ? (
          <motion.div
            className="rfq-success-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "20px 0", display: "grid", gap: "16px" }}
          >
            <div className="rfq-success-icon" style={{
              width: "88px", height: "88px", borderRadius: "50%",
              background: "var(--color-accent-muted)", border: "2px solid var(--color-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <Check size={40} color="var(--color-accent)" strokeWidth={2.4} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px" }}>
              RFQ Summary Generated
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Thank you, {data.contactPerson}. Your RFQ has been submitted for feasibility review. No pricing is promised before our team checks supplier fit, quality expectations, and export handling.
            </p>
            <div className="rfq-success-list rfq-review-card" style={{ display: "grid", gap: "8px", textAlign: "left", maxWidth: "440px", margin: "0 auto", width: "100%" }}>
              <ReviewRow label="RFQ submitted" value="Complete" />
              <ReviewRow label="PDF generated" value={submitResult?.pdfFileName || "Complete"} />
              <ReviewRow label="PDF download" value="Started automatically" />
              <ReviewRow label="Email" value={submitResult?.emailSent ? "Sent to Safar Traders" : (submitResult?.emailNote || "Not available — use WhatsApp instead")} />
              <ReviewRow
                label="WhatsApp"
                value={submitResult?.whatsappBuyerSent || submitResult?.whatsappTeamSent ? "PDF/status sent automatically where configured" : "Manual WhatsApp share available"}
              />
              <ReviewRow label="WhatsApp note" value={submitResult?.whatsappNote} />
            </div>
            <div className="rfq-success-actions" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "4px" }}>
              {submitResult?.pdfBase64 && (
                <a
                  href={`data:application/pdf;base64,${submitResult.pdfBase64}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={submitResult.pdfFileName || "Safar-Traders-RFQ-Summary.pdf"}
                  className="btn btn-primary"
                >
                  Download / Preview PDF
                </a>
              )}
              {submitResult?.whatsappManualUrl && (
                <a
                  href={submitResult.whatsappManualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Open WhatsApp Share
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <Step1 data={data} set={set} />}
              {step === 1 && <Step2 data={data} set={set} setBool={setBool} />}
              {step === 2 && <Step3 data={data} set={set} />}
              {step === 3 && <Step4 data={data} set={set} />}
              {step === 4 && <Step5 data={data} set={set} setBool={setBool} setPhone={setPhone} setWhatsapp={setWhatsapp} />}
              {step === 5 && <Step6 data={data} />}
            </motion.div>
          </AnimatePresence>
        )}
        {error && (
          <p role="alert" style={{ color: "#b42318", fontSize: "13px", marginTop: "12px" }}>{error}</p>
        )}
        </div>
      </div>

      {/* Footer nav */}
      {!submitted && (
        <div className="rfq-wizard-footer" style={{
          padding: "16px clamp(18px, 4vw, 56px)",
          borderTop: "1px solid var(--color-border-light)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          <div style={{ width: "100%", maxWidth: "720px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none",
              color: step === 0 ? "var(--color-text-tertiary)" : "var(--color-text-secondary)",
              fontSize: "14px", fontWeight: 600,
              cursor: step === 0 ? "default" : "pointer",
              padding: "10px 6px",
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canNext()}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: canNext() ? "var(--color-text-primary)" : "var(--color-bg-tertiary)",
                border: "none", borderRadius: "999px",
                padding: "12px 24px", color: canNext() ? "#fff" : "var(--color-text-tertiary)", fontWeight: 600,
                fontSize: "15px", cursor: canNext() ? "pointer" : "default",
              }}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext() || submitting}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: canNext() ? "var(--color-text-primary)" : "var(--color-bg-tertiary)",
                border: "none", borderRadius: "999px",
                padding: "12px 24px", color: canNext() ? "#fff" : "var(--color-text-tertiary)", fontWeight: 600,
                fontSize: "15px", cursor: canNext() ? "pointer" : "default",
              }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {submitting ? "Generating PDF..." : "Submit & Generate PDF"}
            </button>
          )}
          </div>
          {!canNext() && <p role="status" style={{ width: "100%", maxWidth: "720px", margin: "0", color: "var(--color-text-secondary)", fontSize: "12px", textAlign: "right" }}>{nextRequirementMessage()}</p>}
        </div>
      )}
    </motion.div>
  );
}
