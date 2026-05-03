import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";

/* =========================================================
   KINGDOM HALL SCHEDULING SYSTEM
   Full App.jsx
   Includes:
   - AV Scheduler
   - AV Summary
   - Theocratic Scheduler
   - Per-row JW.org Sync
   - Workbook Setup manual parser
   - Dynamic student parts
   - Appointed Balance
   - Publisher Balance
   - Detailed summaries
   - Printable Schedule below Parts Table
   ========================================================= */

/* =========================================================
   DATA
   ========================================================= */

const AV_BROTHERS = [
  "Aldreen Pascobillo",
  "Alex Balin",
  "Allan Bustamante",
  "Allan Mal-In",
  "Andrei Lagumen",
  "Clarence Umotoy",
  "Edwin Supan",
  "Elmer Tamondong",
  "Eugene Masangkay",
  "Guillaume Arenas",
  "Herry Rivera",
  "Irish Forteza",
  "Irwin Umotoy",
  "Jeremy Ico",
  "Jess Dela Cruz",
  "Jimmy Umotoy",
  "Jordan Rios",
  "Justin Ico",
  "Kian Ogoy",
  "Manuel Hernandez",
  "Mark Alcantara",
  "Xian Bautista",
];

const SOUND_TEAM = [
  "Justin Ico",
  "Alex Balin",
  "Aldreen Pascobillo",
  "Andrei Lagumen",
  "Jeremy Ico",
  "Jimmy Umotoy",
  "Irish Forteza",
  "Eugene Masangkay",
  "Kian Ogoy",
  "Guillaume Arenas",
];

const AV_NOTES_OPTIONS = [
  "Midweek Meeting",
  "Weekend Meeting",
  "Memorial",
  "Special Talk",
  "Assembly",
  "Circuit Assembly",
  "Regional Convention",
  "International Convention",
  "Cancelled",
  "No Meeting",
  "Other",
];

const ELDERS = [
  "Alex Balin",
  "Alex Meman",
  "Alvin Noveno",
  "Arnel Arenas",
  "Cesar Pascobillo",
  "Edjie Allado",
  "Genesis Durandar",
  "Jake Ico",
  "James Bautista",
  "Jonel Ramos",
  "Joy Bustamante",
  "Marlo Ogoy",
  "Polinor Nobesteros",
  "Moises Demot",
  "Zhire Azul",
];

const MINISTERIALS = [
  "Aldreen Pascobillo",
  "Andrei Lagumen",
  "Edwin Supan",
  "Herry Rivera",
  "Jess Dela Cruz",
  "Jimmy Umotoy",
  "Jundy Raga",
  "Justin Ico",
  "Kian Ogoy",
  "Jedrey Soriano",
];

const APPOINTED_BROTHERS = [...ELDERS, ...MINISTERIALS];

const PUBLISHER_GROUPS = {
  "Group 1": [
    "Clarice Yvonne Arenas",
    "Guillaume Keifer Arenas",
    "Sheryl Arenas",
    "Allan Bustamante",
    "Jenny Bustamante",
    "Clarice Cruz",
    "Rosalina Cuizon",
    "Michael Ebero",
    "Janeth Natividad",
    "Juanito, Jr. Natividad",
    "Rica Regalado",
    "Carrie Lyn Umotoy",
    "Jean Clarence Umotoy",
    "Mike Irwin Umotoy",
    "Veronica Vargas",
  ],
  "Group 2": [
    "Doris Balbon",
    "Jessica Balbon",
    "Sherry Ann Durandar",
    "Mari Fe Galabo",
    "Josefina Gismundo",
    "Evelyn Henson",
    "Agnes Hernandez",
    "Elaine Pascobillo",
    "Helen Pascobillo",
    "Teresita Quiballo",
    "Rebecca Reyes",
    "Richie Reyes",
    "Nora Vargas",
    "Jake Largadas",
    "Divina Reyes",
  ],
  "Group 3": [
    "Editha Bustamante",
    "Joyce Bustamante",
    "Liziel Bustamante",
    "Jose Bustamante, Jr.",
    "Jenifer dela Cruz",
    "Jewel Kimberly dela Cruz",
    "Richel Iballar",
    "Virginita Largadas",
    "Claudine Jonielyn Ong",
    "Sarah Mae Ong",
    "Jennifer Raga",
    "Rodolfo Jr. Raga",
    "Yaninah Breanna Raga",
    "Socorro Samortin",
    "Eugene Masangkay",
  ],
  "Group 4": [
    "Phoebe Cator",
    "Stalene Ashley Cator",
    "Eunice Gilboy",
    "Bianca Camille Laurin",
    "Lolita Lopez",
    "Erica Noveno",
    "Pamela Ogoy",
    "Felisa Plata",
    "Jordan Rios",
    "Ma. Ina Celine Rios",
    "Maria Luisa Supan",
    "Elmer Tamondong",
  ],
  "Group 5": [
    "Jade Allado",
    "Maria Riza Allado",
    "Monette Apocada",
    "Adrian Azul",
    "Diana Azul",
    "Driszha Azul",
    "Lanz Azul",
    "Nerissa Azul",
    "Sherwin Azul",
    "Manuel Hernandez",
    "Virginia Hernandez",
    "Wenrich Lorenzo",
    "Christine Ramos",
    "Lloyd Varian Valencia",
  ],
  "Group 6": [
    "Marites Alcantara",
    "Mark Edison Alcantara",
    "Roma Allado",
    "Adelaida dela Cuesta",
    "Estelita Dacumos",
    "Irish Wyne Forteza",
    "Krizza Mae Forteza",
    "Loriedel Lagumen",
    "Bea Nobesteros",
    "Violita Nobesteros",
    "Arian Robelyn Plocios",
    "Hiroaki Santiago",
    "Joanne Marie Santiago",
    "Raquel Santos",
  ],
  "Group 7": [
    "Honorata Durandar",
    "Norly Jane Durandar",
    "Nicole Fedalizo",
    "Verna Gismundo",
    "Donabella Ico",
    "Jeconias Ico",
    "Jeremy David Ico",
    "Julianne Denise Ico",
    "Reu Ladeza",
    "Bievilyn Rivera",
    "Marcelina Santos",
    "Romeo Sareno",
    "Crarisa Jane Valencia",
  ],
  "Group 8": [
    "Maricor Alunan",
    "Alexander, Jr Balin",
    "Catalina Balin",
    "Crystal Balin",
    "Ma. Victoria Demot",
    "Daniel Epilepsia",
    "Grace Joyce Epilepsia",
    "Mary Ann Epilepsia",
    "Ruth Epilepsia",
    "Allan Eliezer Mal-in",
    "Kasey Marzo",
    "Katrina Marzo",
    "Mark Sonny del Rosario",
    "Soledad del Rosario",
    "Alexander Meman",
    "Mary Joyce Meman",
  ],
  "Group 9": [
    "Jehna Allado",
    "Mabelle Bautista",
    "Xian Bautista",
    "Daniel Jr. Epilepsia",
    "Braize Ann Queency Esmeria",
    "Imelda Esmeria",
    "Karla Marjorie Esmeria",
    "Kevin Esmeria",
    "Kyle Juliana Esmeria",
    "Erjower Gabalfin",
    "Julie Gabalfin",
    "Azreal Gardon",
    "Jocylyn Gismundo",
  ],
};

const PUBLISHERS = Object.values(PUBLISHER_GROUPS).flat();

const ALL_ASSIGNMENT_NAMES = Array.from(
  new Set([...ELDERS, ...MINISTERIALS, ...PUBLISHERS])
);

const COMBINED_ASSIGNMENT_GROUPS = {
  Elders: ELDERS,
  "Ministerial Servants": MINISTERIALS,
  ...PUBLISHER_GROUPS,
};

const APPOINTED_FIELDS = [
  ["chairman", "Chairman"],
  ["openingPrayer", "Pambukas na Panalangin"],
  ["treasuresTalk", "Kayamanan sa Salita ng Diyos"],
  ["spiritualGems", "Espirituwal na Hiyas"],
  ["livingAsChristians", "Pamumuhay Bilang Kristiyano"],
  ["cbs", "Pag-aaral ng Kongregasyon sa Bibliya"],
  ["reader", "Reader"],
  ["closingPrayer", "Pangwakas na Panalangin"],
];

const STUDENT_PART_TYPES = [
  "Pagpapasimula ng Pakikipag-usap",
  "Pakikipag-usap Muli",
  "Paggawa ng mga Alagad",
  "Ipaliwanag ang Paniniwala Mo",
  "Pahayag",
];

const STUDENT_TYPE_TO_ENGLISH = {
  "Pagpapasimula ng Pakikipag-usap": "Starting a Conversation",
  "Pakikipag-usap Muli": "Following Up",
  "Paggawa ng mga Alagad": "Making Disciples",
  "Ipaliwanag ang Paniniwala Mo": "Explain Your Belief",
  Pahayag: "Talk",
};

const ENGLISH_TO_STUDENT_TYPE = {
  "Starting a Conversation": "Pagpapasimula ng Pakikipag-usap",
  "Following Up": "Pakikipag-usap Muli",
  "Making Disciples": "Paggawa ng mga Alagad",
  "Explain Your Belief": "Ipaliwanag ang Paniniwala Mo",
  Talk: "Pahayag",
};

const MAX_STUDENT_PARTS = 5;

const ADDITIONAL_CLASS_GROUP_OPTIONS = [
  "",
  "1 & 2",
  "1 & 3",
  "1 & 4",
  "1 & 5",
  "1 & 6",
  "1 & 7",
  "1 & 8",
  "1 & 9",
  "2 & 3",
  "2 & 4",
  "2 & 5",
  "2 & 6",
  "2 & 7",
  "2 & 8",
  "2 & 9",
  "3 & 4",
  "3 & 5",
  "3 & 6",
  "3 & 7",
  "3 & 8",
  "3 & 9",
  "4 & 5",
  "4 & 6",
  "4 & 7",
  "4 & 8",
  "4 & 9",
  "5 & 6",
  "5 & 7",
  "5 & 8",
  "5 & 9",
  "6 & 7",
  "6 & 8",
  "6 & 9",
  "7 & 8",
  "7 & 9",
  "8 & 9",
];

const MEETING_STATUS_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "memorial", label: "Memorial" },
  { value: "assembly", label: "Assembly" },
  { value: "convention", label: "Convention" },
  { value: "special-event", label: "Special Event" },
];

function getStatusLabel(value) {
  return MEETING_STATUS_OPTIONS.find((item) => item.value === value)?.label || "Normal";
}

function getAdditionalClassLabel(groups) {
  return groups ? `Karagdagang Klase (Groups ${groups})` : "Karagdagang Klase";
}

/* =========================================================
   HELPERS
   ========================================================= */

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function formatTagalogDate(date) {
  const tagalogMonths = [
    "ENERO",
    "PEBRERO",
    "MARSO",
    "ABRIL",
    "MAYO",
    "HUNYO",
    "HULYO",
    "AGOSTO",
    "SETYEMBRE",
    "OKTUBRE",
    "NOBYEMBRE",
    "DISYEMBRE",
  ];

  return `${tagalogMonths[date.getMonth()]} ${date.getDate()}`;
}

function generateMeetingRows(monthValue) {
  if (!monthValue || !monthValue.includes("-")) return [];

  const [yearText, monthText] = monthValue.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month) return [];

  const date = new Date(year, month - 1, 1);
  const rows = [];

  while (date.getMonth() === month - 1) {
    const day = date.getDay();

    if (day === 4 || day === 0) {
      rows.push({
        date: formatDate(date),
        tagalogDate: formatTagalogDate(date),
        meeting: day === 4 ? "Midweek Meeting" : "Weekend Meeting",
      });
    }

    date.setDate(date.getDate() + 1);
  }

  return rows;
}

function makeAVRows(monthValue) {
  return generateMeetingRows(monthValue).map((row) => ({
    ...row,
    soundSystem1: "",
    soundSystem2: "",
    micRoving1: "",
    micRoving2: "",
    stagePlatform: "",
    notes: row.meeting,
  }));
}

function makeTheocraticRows(monthValue) {
  return generateMeetingRows(monthValue)
    .filter((row) => row.meeting === "Midweek Meeting")
    .map((row, index) => {
      const newRow = {
        ...row,
        workbookUrl: "",
        syncStatus: "",
        bibleReading: "",
        bibleReadingAdditional: "",
        studentParts: [
          { type: "Pagpapasimula ng Pakikipag-usap", title: "Pagpapasimula ng Pakikipag-usap", time: "", minutes: "", publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" },
          { type: "Pakikipag-usap Muli", title: "Pakikipag-usap Muli", time: "", minutes: "", publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" },
          { type: "Paggawa ng mga Alagad", title: "Paggawa ng mga Alagad", time: "", minutes: "", publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" },
          { type: index === 0 ? "Pahayag" : "", title: index === 0 ? "Pahayag" : "", time: "", minutes: "", publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" },
          { type: "", title: "", time: "", minutes: "", publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" },
        ],
        workbook: {
          weekTitle: "",
          bibleChapters: "",
          songs: {
            opening: "",
            middle: "",
            closing: "",
          },
          openingSong: "",
          middleSong: "",
          closingSong: "",
          openingCommentTime: "7:05",
          treasuresTitle: "",
          treasuresTime: "7:06",
          gemsTime: "7:16",
          bibleReadingTime: "7:26",
          ministryStartTime: "7:31",
          livingSongTime: "7:47",
          livingStartTime: "7:52",
          cbsTime: "8:07",
          closingCommentsTime: "8:37",
          closingSongTime: "8:40",
          livingParts: [],
        },
      };

      APPOINTED_FIELDS.forEach(([field]) => {
        newRow[field] = "";
      });

      return newRow;
    });
}

function countColor(total) {
  if (total === 0) return "red";
  if (total === 1) return "yellow";
  return "green";
}

function normalizeStudentType(type) {
  if (!type) return "";
  if (ENGLISH_TO_STUDENT_TYPE[type]) return ENGLISH_TO_STUDENT_TYPE[type];
  if (STUDENT_PART_TYPES.includes(type)) return type;
  return type;
}

function needsPartner(type) {
  return Boolean(type) && type !== "Pahayag";
}

function inferStudentTypeFromTitle(title) {
  const text = String(title || "").toLowerCase();

  if (text.includes("pagpapasimula") || text.includes("starting")) {
    return "Pagpapasimula ng Pakikipag-usap";
  }

  if (text.includes("pakikipag-usap muli") || text.includes("following")) {
    return "Pakikipag-usap Muli";
  }

  if (text.includes("alagad") || text.includes("making disciples")) {
    return "Paggawa ng mga Alagad";
  }

  if (text.includes("paniniwala") || text.includes("belief")) {
    return "Ipaliwanag ang Paniniwala Mo";
  }

  if (text.includes("pahayag") || text.includes("talk")) {
    return "Pahayag";
  }

  return normalizeStudentType(title);
}

function buildStudentPartsFromWorkbook(week) {
  const rawParts = Array.isArray(week?.studentParts) ? week.studentParts : [];

  return Array.from({ length: MAX_STUDENT_PARTS }).map((_, partIndex) => {
    const rawPart = rawParts[partIndex];

    if (!rawPart) {
      return {
        type: "",
        title: "",
        time: "",
        minutes: "",
        publisher: "",
        partnerPublisher: "",
        additionalPublisher: "",
        additionalPartnerPublisher: "",
      };
    }

    if (typeof rawPart === "string") {
      return {
        type: inferStudentTypeFromTitle(rawPart),
        title: rawPart,
        time: "",
        minutes: "",
        publisher: "",
        partnerPublisher: "",
        additionalPublisher: "",
        additionalPartnerPublisher: "",
      };
    }

    return {
      type: inferStudentTypeFromTitle(rawPart.type || rawPart.title),
      title: rawPart.title || rawPart.type || "",
      time: rawPart.time || "",
      minutes: rawPart.minutes || "",
      publisher: "",
      partnerPublisher: "",
    };
  });
}

function detectStudentPartFromLine(line) {
  const text = line.toLowerCase();

  if (text.includes("starting") || text.includes("pagpapasimula")) {
    return "Pagpapasimula ng Pakikipag-usap";
  }

  if (text.includes("following") || text.includes("muli")) {
    return "Pakikipag-usap Muli";
  }

  if (text.includes("making disciples") || text.includes("alagad")) {
    return "Paggawa ng mga Alagad";
  }

  if (
    text.includes("explain") ||
    text.includes("belief") ||
    text.includes("paniniwala")
  ) {
    return "Ipaliwanag ang Paniniwala Mo";
  }

  if (text.includes("talk") || text.includes("pahayag")) {
    return "Pahayag";
  }

  return null;
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function MainTabs({ active, setActive }) {
  return (
    <div className="main-tabs">
      <button
        className={active === "av" ? "active" : ""}
        onClick={() => setActive("av")}
      >
        AV Scheduler
      </button>
      <button
        className={active === "theocratic" ? "active" : ""}
        onClick={() => setActive("theocratic")}
      >
        Theocratic Scheduler
      </button>
    </div>
  );
}

function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs[active]?.content}</div>
    </div>
  );
}

function SelectCell({ value, onChange, list }) {
  return (
    <select value={value || ""} onChange={onChange}>
      <option value=""></option>
      {list.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

function TheocraticSelect({ value, onChange }) {
  return (
    <select value={value || ""} onChange={onChange}>
      <option value=""></option>

      <optgroup label="Elders">
        {ELDERS.map((name) => (
          <option key={`elder-${name}`} value={name}>
            {name}
          </option>
        ))}
      </optgroup>

      <optgroup label="Ministerial Servants">
        {MINISTERIALS.map((name) => (
          <option key={`ms-${name}`} value={name}>
            {name}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

function PublisherSelect({ value, onChange, includeAppointed = true }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sourceGroups = includeAppointed
    ? COMBINED_ASSIGNMENT_GROUPS
    : PUBLISHER_GROUPS;

  const keyword = search.trim().toLowerCase();

  const filteredGroups = Object.entries(sourceGroups)
    .map(([group, names]) => [
      group,
      names.filter((name) => name.toLowerCase().includes(keyword)),
    ])
    .filter(([, names]) => names.length > 0);

  const chooseName = (name) => {
    onChange({ target: { value: name } });
    setSearch("");
    setOpen(false);
  };

  const clearName = () => {
    onChange({ target: { value: "" } });
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="custom-combobox">
      <button
        type="button"
        className="combo-display"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value || "Select name..."}</span>
        <span className="combo-arrow">▾</span>
      </button>

      {open ? (
        <div className="combo-panel">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name..."
            className="combo-search"
          />

          <button
            type="button"
            className="combo-clear"
            onClick={clearName}
          >
            Clear selection
          </button>

          <div className="combo-options">
            {filteredGroups.length ? (
              filteredGroups.map(([group, names]) => (
                <div key={group} className="combo-group">
                  <div className="combo-group-label">{group}</div>

                  {names.map((name) => (
                    <button
                      type="button"
                      key={`${group}-${name}`}
                      className={`combo-option ${value === name ? "selected" : ""}`}
                      onClick={() => chooseName(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="combo-empty">No names found</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BalanceCard({ name, total, lastDate, lastPart }) {
  return (
    <div className={`balance-card ${countColor(total)}`}>
      <strong>{name}</strong>
      <span>Total: {total}</span>
      {lastDate ? (
        <small>
          Last: {lastDate}
          {lastPart ? ` — ${lastPart}` : ""}
        </small>
      ) : (
        <small>Last: None yet</small>
      )}
    </div>
  );
}

/* =========================================================
   PRINTABLE SCHEDULE COMPONENT
   ========================================================= */

function PrintableSchedule({ rows }) {
  const rowsPerPage = 2;

  const pages = rows.reduce((result, row, index) => {
    if (index % rowsPerPage === 0) {
      result.push([]);
    }
    result[result.length - 1].push(row);
    return result;
  }, []);

  const formatStudentNames = (part, hall = "main") => {
    if (!part) return "";

    const first =
      hall === "additional" ? part.additionalPublisher || "" : part.publisher || "";

    const second =
      hall === "additional"
        ? part.additionalPartnerPublisher || ""
        : part.partnerPublisher || "";

    if (needsPartner(part.type)) {
      if (first && second) return `${first} / ${second}`;
      return first || second;
    }

    return first;
  };

  const ministryRows = (row) =>
    row.studentParts
      .filter((part) => part.type)
      .map((part, index) => ({
        number: index + 4,
        time: part.time || "",
        title: part.title || part.type,
        label: needsPartner(part.type) ? "Estudyante/Assistant:" : "Estudyante:",
        mainHall: formatStudentNames(part, "main"),
        additionalClass: formatStudentNames(part, "additional"),
      }));

  const renderSchedule = (row, index) => {
    const openingSong = row.workbook?.openingSong || row.workbook?.songs?.opening || "";
    const middleSong = row.workbook?.middleSong || row.workbook?.songs?.middle || "";
    const closingSong = row.workbook?.closingSong || row.workbook?.songs?.closing || "";
    const bibleChapters = row.workbook?.bibleChapters || "";
    const firstLivingPart =
      row.workbook?.livingParts?.[0] || "Pamumuhay Bilang Kristiyano";
    const hasNoMeeting = row.meetingStatus && row.meetingStatus !== "normal";

    return (
      <div key={`${row.date}-${index}`} className="s140-schedule-block">
        <div className="s140-week-line">
          {(row.tagalogDate || row.date).toUpperCase()}{" "}
          {bibleChapters ? `| ${bibleChapters}` : ""}
        </div>

        <div className="s140-top-assignments">
          <div></div>
          <div className="s140-role">Chairman:</div>
          <div className="s140-name">{row.chairman}</div>

          <div></div>
          <div className="s140-role">Tagapayo sa Karagdagang Klase:</div>
          <div className="s140-name">{row.additionalClassCounselor}</div>
        </div>

        {hasNoMeeting ? (
          <div className="s140-no-meeting">
            <h2>WALANG PULONG SA GITNANG SANLINGGO</h2>
            <p>{getStatusLabel(row.meetingStatus)}</p>
          </div>
        ) : (
          <>
            <div className="s140-row s140-row-normal">
              <div className="s140-time">7:00</div>
              <div className="s140-part italic-bold">Awit Bilang {openingSong}</div>
              <div className="s140-role-inline">Panalangin:</div>
              <div className="s140-name-inline" data-hall="main">{row.openingPrayer}</div>
            </div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.openingCommentTime || "7:05"}</div>
              <div className="s140-part">Pambungad na Komento&nbsp; (1 min.)</div>
              <div></div>
              <div></div>
            </div>

            <div className="s140-section s140-blue">KAYAMANAN MULA SA SALITA NG DIYOS</div>

            <div className="s140-class-header">
              <div></div>
              <div></div>
              <div></div>
              <div>{getAdditionalClassLabel(row.additionalClassGroups)}</div>
              <div>Main Hall</div>
            </div>

            <div className="s140-row">
              <div className="s140-time">{row.workbook?.treasuresTime || "7:06"}</div>
              <div className="s140-part">
                1. {row.workbook?.treasuresTitle || "Kayamanan sa Salita ng Diyos"}&nbsp; (10 min.)
              </div>
              <div></div>
              <div></div>
              <div className="s140-name-inline">{row.treasuresTalk}</div>
            </div>

            <div className="s140-row">
              <div className="s140-time">{row.workbook?.gemsTime || "7:16"}</div>
              <div className="s140-part">2. Espirituwal na Hiyas&nbsp; (10 min.)</div>
              <div></div>
              <div></div>
              <div className="s140-name-inline">{row.spiritualGems}</div>
            </div>

            <div className="s140-row">
              <div className="s140-time">{row.workbook?.bibleReadingTime || "7:26"}</div>
              <div className="s140-part">3. Pagbabasa ng Bibliya&nbsp; (4 min.)</div>
              <div className="s140-role-inline">Estudyante:</div>
              <div className="s140-name-inline">{row.bibleReadingAdditional}</div>
              <div className="s140-name-inline">{row.bibleReading}</div>
            </div>

            <div className="s140-section s140-gold">MAGING MAHUSAY SA MINISTERYO</div>

            <div className="s140-class-header">
              <div></div>
              <div></div>
              <div></div>
              <div>{getAdditionalClassLabel(row.additionalClassGroups)}</div>
              <div>Main Hall</div>
            </div>

            {ministryRows(row).map((part, partIndex) => (
              <div className="s140-row ministry-row" key={`${row.date}-ministry-${partIndex}`}>
                <div className="s140-time">{part.time}</div>
                <div className="s140-part">
                  {part.number}. {part.title}
                </div>
                <div className="s140-role-inline">{part.label}</div>
                <div className="s140-name-inline">{part.additionalClass}</div>
                <div className="s140-name-inline">{part.mainHall}</div>
              </div>
            ))}

            <div className="s140-section s140-red">PAMUMUHAY BILANG KRISTIYANO</div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.livingSongTime || "7:47"}</div>
              <div className="s140-part italic-bold">Awit Bilang {middleSong}</div>
              <div></div>
              <div></div>
            </div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.livingStartTime || "7:52"}</div>
              <div className="s140-part">{firstLivingPart}</div>
              <div></div>
              <div className="s140-name-inline">{row.livingAsChristians}</div>
            </div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.cbsTime || "8:07"}</div>
              <div className="s140-part">Pag-aaral ng Kongregasyon sa Bibliya&nbsp; (30 min.)</div>
              <div className="s140-role-inline">Konduktor/Tagabasa:</div>
              <div className="s140-name-inline">
                {row.cbs}
                {row.reader ? ` / ${row.reader}` : ""}
              </div>
            </div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.closingCommentsTime || "8:37"}</div>
              <div className="s140-part">Pangwakas na Komento&nbsp; (3 min.)</div>
              <div></div>
              <div className="s140-name-inline">{row.chairman}</div>
            </div>

            <div className="s140-row s140-row-normal">
              <div className="s140-time">{row.workbook?.closingSongTime || "8:40"}</div>
              <div className="s140-part italic-bold">Awit Bilang {closingSong}</div>
              <div className="s140-role-inline">Panalangin:</div>
              <div className="s140-name-inline">{row.closingPrayer}</div>
            </div>

          </>
        )}
      </div>
    );
  };

  return (
    <div className="printable-area">
      <div className="print-actions">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      {pages.map((pageRows, pageIndex) => (
        <div key={`print-page-${pageIndex}`} className="s140-page s140-page-double">
          <div className="s140-page-header">
            <div className="s140-cong">LITTLE BAGUIO CONGREGATION</div>
            <div className="s140-main-title">Iskedyul ng Pulong sa Gitnang Sanlinggo</div>
          </div>

          {pageRows.map((row, rowIndex) => renderSchedule(row, rowIndex))}

          <div className="s140-page-footer">
            S-140-TG&nbsp;&nbsp; 05/26
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   AV SCHEDULER
   ========================================================= */

function AVScheduler() {
  const [title, setTitle] = useState("LBC TECHNICAL SCHEDULE");
  const [month, setMonth] = useState("2026-04");
  const [rows, setRows] = useState(() => makeAVRows("2026-04"));
  const avTableRef = useRef(null);

  useEffect(() => {
    setRows(makeAVRows(month));
  }, [month]);

  const updateRow = (index, field, value) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleBulkSync = async () => {
    const links = bulkLinks
      .split(/\n|,|;/)
      .map((link) => link.trim())
      .filter(Boolean);

    if (!links.length) {
      alert("Paste at least one workbook link.");
      return;
    }

    for (let index = 0; index < links.length; index += 1) {
      if (!rows[index]) break;
      await syncWorkbookRow(index, links[index]);
    }

    alert("Bulk sync complete. Please review the detected parts.");
  };

  const autoFill = () => {
    setRows((current) =>
      current.map((row) => {
        const used = new Set();

        const pick = (list) => {
          const chosen = shuffle(list).find((name) => !used.has(name));
          if (chosen) used.add(chosen);
          return chosen || "";
        };

        return {
          ...row,
          soundSystem1: pick(SOUND_TEAM),
          soundSystem2: pick(SOUND_TEAM),
          micRoving1: pick(AV_BROTHERS),
          micRoving2: pick(AV_BROTHERS),
          stagePlatform: pick(AV_BROTHERS),
        };
      })
    );
  };

  const clear = () => {
    setRows((current) =>
      current.map((row) => ({
        ...row,
        soundSystem1: "",
        soundSystem2: "",
        micRoving1: "",
        micRoving2: "",
        stagePlatform: "",
      }))
    );
  };

  const exportAVImage = async () => {
    if (!avTableRef.current) return;

    const controls = avTableRef.current.querySelectorAll("select, input");
    const replacements = [];

    controls.forEach((control) => {
      const span = document.createElement("span");
      span.textContent = control.value || "";
      span.className = "export-text-value";
      control.style.display = "none";
      control.parentNode.insertBefore(span, control);
      replacements.push({ control, span });
    });

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "visible";

    try {
      const canvas = await html2canvas(avTableRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: avTableRef.current.scrollWidth,
        windowHeight: avTableRef.current.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = "lbc-technical-schedule.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      document.body.style.overflow = originalOverflow;

      replacements.forEach(({ control, span }) => {
        control.style.display = "";
        span.remove();
      });
    }
  };

  const summary = useMemo(() => {
    const map = {};

    AV_BROTHERS.forEach((name) => {
      map[name] = {
        name,
        sound: 0,
        mic1: 0,
        mic2: 0,
        stage: 0,
        total: 0,
      };
    });

    rows.forEach((row) => {
      const add = (name, key) => {
        if (!name || !map[name]) return;
        map[name][key] += 1;
        map[name].total += 1;
      };

      add(row.soundSystem1, "sound");
      add(row.soundSystem2, "sound");
      add(row.micRoving1, "mic1");
      add(row.micRoving2, "mic2");
      add(row.stagePlatform, "stage");
    });

    return Object.values(map).sort(
      (a, b) => b.total - a.total || a.name.localeCompare(b.name)
    );
  }, [rows]);

  return (
    <div className="section">
      <div className="toolbar">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Schedule title"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={autoFill}>Auto-fill</button>
        <button onClick={clear}>Clear</button>
        <button onClick={exportAVImage}>Export AV Image</button>
      </div>

      <Tabs
        tabs={[
          {
            label: "AV Table",
            content: (
              <div className="card scroll av-export-card" ref={avTableRef}>
                <h2>{title}</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th colSpan="2">Sound System</th>
                      <th>Mic Roving 1</th>
                      <th>Mic Roving 2</th>
                      <th>Stage Platform</th>
                      <th>Notes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.date}-${index}`}>
                        <td>{row.date}</td>
                        <td>
                          <SelectCell
                            value={row.soundSystem1}
                            list={SOUND_TEAM}
                            onChange={(e) =>
                              updateRow(index, "soundSystem1", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <SelectCell
                            value={row.soundSystem2}
                            list={SOUND_TEAM}
                            onChange={(e) =>
                              updateRow(index, "soundSystem2", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <SelectCell
                            value={row.micRoving1}
                            list={AV_BROTHERS}
                            onChange={(e) =>
                              updateRow(index, "micRoving1", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <SelectCell
                            value={row.micRoving2}
                            list={AV_BROTHERS}
                            onChange={(e) =>
                              updateRow(index, "micRoving2", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <SelectCell
                            value={row.stagePlatform}
                            list={AV_BROTHERS}
                            onChange={(e) =>
                              updateRow(index, "stagePlatform", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <SelectCell
                            value={row.notes}
                            list={AV_NOTES_OPTIONS}
                            onChange={(e) =>
                              updateRow(index, "notes", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            label: "AV Summary",
            content: (
              <div className="card scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Brother</th>
                      <th>Sound</th>
                      <th>Mic 1</th>
                      <th>Mic 2</th>
                      <th>Stage</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.sound}</td>
                        <td>{item.mic1}</td>
                        <td>{item.mic2}</td>
                        <td>{item.stage}</td>
                        <td>
                          <strong>{item.total}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

/* =========================================================
   THEOCRATIC SCHEDULER
   ========================================================= */

function TheocraticScheduler() {
  const [title, setTitle] = useState("LBC THEOCRATIC PARTS SCHEDULE");
  const [month, setMonth] = useState("2026-04");
  const [rows, setRows] = useState(() => makeTheocraticRows("2026-04"));
  const [workbookPaste, setWorkbookPaste] = useState({});
  const [showPrintable, setShowPrintable] = useState(false);
  const [bulkLinks, setBulkLinks] = useState("");
  const [appointedSearch, setAppointedSearch] = useState("");
  const [publisherSearch, setPublisherSearch] = useState("");

  useEffect(() => {
    setRows(makeTheocraticRows(month));
    setWorkbookPaste({});
  }, [month]);

  const updateRow = (index, field, value) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const updateStudentPart = (rowIndex, partIndex, field, value) => {
    setRows((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row;

        const studentParts = row.studentParts.map((part, pIndex) => {
          if (pIndex !== partIndex) return part;

          const updatedPart = { ...part, [field]: value };

          if (field === "type") {
            if (!updatedPart.title || STUDENT_PART_TYPES.includes(updatedPart.title)) {
              updatedPart.title = value;
            }

            if (!needsPartner(value)) {
              updatedPart.partnerPublisher = "";
              updatedPart.additionalPartnerPublisher = "";
            }
          }

          return updatedPart;
        });

        return { ...row, studentParts };
      })
    );
  };

  const updateWorkbookUrl = (rowIndex, value) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, workbookUrl: value } : row
      )
    );
  };

  const parseWorkbookText = (rowIndex) => {
    const text = workbookPaste[rowIndex] || "";

    const detected = text
      .split(/\n|\r/)
      .map((line) => detectStudentPartFromLine(line.trim()))
      .filter(Boolean)
      .slice(0, MAX_STUDENT_PARTS);

    setRows((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row;

        const studentParts = Array.from({ length: MAX_STUDENT_PARTS }).map(
          (_, partIndex) => ({
            type: detected[partIndex] || "",
            publisher: "",
          })
        );

        return { ...row, studentParts };
      })
    );
  };

  const syncWorkbookRow = async (rowIndex, optionalUrl = "") => {
    const row = rows[rowIndex];
    const url = optionalUrl.trim() || row?.workbookUrl?.trim();

    if (row?.meetingStatus && row.meetingStatus !== "normal") {
      setRows((current) =>
        current.map((item, index) =>
          index === rowIndex
            ? {
                ...item,
                syncStatus: `Sync skipped because this row is marked as ${getStatusLabel(row.meetingStatus)}.`,
              }
            : item
        )
      );
      return;
    }

    if (!url) {
      setRows((current) =>
        current.map((item, index) =>
          index === rowIndex
            ? { ...item, syncStatus: "Please paste a JW.org workbook link first." }
            : item
        )
      );
      return;
    }

    setRows((current) =>
      current.map((item, index) =>
        index === rowIndex
          ? { ...item, syncStatus: "Syncing workbook..." }
          : item
      )
    );

    try {
      const response = await fetch("/sync-workbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      const data = await response.json();
      const week = Array.isArray(data.weeks) ? data.weeks[0] : null;

      if (!week) {
        throw new Error("No week data returned");
      }

      const detected = Array.isArray(week.studentParts)
        ? week.studentParts.slice(0, MAX_STUDENT_PARTS).map(normalizeStudentType)
        : [];

      const studentParts = Array.from({ length: MAX_STUDENT_PARTS }).map(
        (_, partIndex) => ({
          type: detected[partIndex] || "",
          publisher: "",
        })
      );

      setRows((current) =>
        current.map((item, index) => {
          if (index !== rowIndex) return item;

          return {
            ...item,
            studentParts,
            syncStatus: "Synced. Review the detected parts before assigning names.",
            workbook: {
              ...item.workbook,
              weekTitle: week.weekTitle || item.workbook?.weekTitle || item.date,
              bibleChapters:
                week.bibleChapters || item.workbook?.bibleChapters || "",
              songs: {
                opening: week.songs?.[0] || week.openingSong || item.workbook?.songs?.opening || "",
                middle: week.songs?.[1] || week.middleSong || item.workbook?.songs?.middle || "",
                closing: week.songs?.[2] || week.closingSong || item.workbook?.songs?.closing || "",
              },
              openingSong: week.songs?.[0] || week.openingSong || item.workbook?.openingSong || "",
              middleSong: week.songs?.[1] || week.middleSong || item.workbook?.middleSong || "",
              closingSong: week.songs?.[2] || week.closingSong || item.workbook?.closingSong || "",
              openingCommentTime: week.openingCommentTime || item.workbook?.openingCommentTime || "7:05",
              treasuresTitle:
                week.treasuresTitle || item.workbook?.treasuresTitle || "",
              treasuresTime: week.treasuresTime || item.workbook?.treasuresTime || "7:06",
              gemsTime: week.gemsTime || item.workbook?.gemsTime || "7:16",
              bibleReadingTime: week.bibleReadingTime || item.workbook?.bibleReadingTime || "7:26",
              ministryStartTime: week.ministryStartTime || item.workbook?.ministryStartTime || "7:31",
              livingSongTime: week.livingSongTime || item.workbook?.livingSongTime || "7:47",
              livingStartTime: week.livingStartTime || item.workbook?.livingStartTime || "7:52",
              cbsTime: week.cbsTime || item.workbook?.cbsTime || "8:07",
              closingCommentsTime: week.closingCommentsTime || item.workbook?.closingCommentsTime || "8:37",
              closingSongTime: week.closingSongTime || item.workbook?.closingSongTime || "8:40",
              livingParts: Array.isArray(week.livingParts)
                ? week.livingParts
                : item.workbook?.livingParts || [],
            },
          };
        })
      );
    } catch (error) {
      setRows((current) =>
        current.map((item, index) =>
          index === rowIndex
            ? {
                ...item,
                syncStatus:
                  "Sync failed. Check functions/sync-workbook.js and redeploy to Cloudflare Pages.",
              }
            : item
        )
      );
    }
  };

  const handleBulkSync = async () => {
    const links = bulkLinks
      .split(/\n|,|;/)
      .map((link) => link.trim())
      .filter(Boolean);

    if (!links.length) {
      alert("Paste at least one workbook link.");
      return;
    }

    for (let index = 0; index < links.length; index += 1) {
      if (!rows[index]) break;
      await syncWorkbookRow(index, links[index]);
    }

    alert("Bulk sync complete. Please review the detected parts.");
  };

  const autoFill = () => {
    setRows((current) =>
      current.map((row) => {
        const usedAppointed = new Set();
        const usedPublishers = new Set();

        const next = {
          ...row,
          studentParts: row.studentParts.map((part) => ({ ...part })),
        };

        APPOINTED_FIELDS.forEach(([field]) => {
          const chosen = shuffle(APPOINTED_BROTHERS).find(
            (name) => !usedAppointed.has(name)
          );

          next[field] = chosen || "";

          if (chosen) {
            usedAppointed.add(chosen);
          }
        });

        const bibleReader = shuffle(PUBLISHERS).find(
          (name) => !usedPublishers.has(name)
        );

        next.bibleReading = bibleReader || "";

        if (bibleReader) {
          usedPublishers.add(bibleReader);
        }

        const additionalBibleReader = shuffle(PUBLISHERS).find(
          (name) => !usedPublishers.has(name)
        );

        next.bibleReadingAdditional = additionalBibleReader || "";

        if (additionalBibleReader) {
          usedPublishers.add(additionalBibleReader);
        }

        next.studentParts = next.studentParts.map((part) => {
          if (!part.type) {
            return { ...part, publisher: "", partnerPublisher: "", additionalPublisher: "", additionalPartnerPublisher: "" };
          }

          const publisher = shuffle(PUBLISHERS).find(
            (name) => !usedPublishers.has(name)
          );

          if (publisher) {
            usedPublishers.add(publisher);
          }

          let partnerPublisher = "";
          if (needsPartner(part.type)) {
            partnerPublisher =
              shuffle(PUBLISHERS).find((name) => !usedPublishers.has(name)) || "";

            if (partnerPublisher) {
              usedPublishers.add(partnerPublisher);
            }
          }

          const additionalPublisher =
            shuffle(PUBLISHERS).find((name) => !usedPublishers.has(name)) || "";

          if (additionalPublisher) {
            usedPublishers.add(additionalPublisher);
          }

          let additionalPartnerPublisher = "";

          if (needsPartner(part.type)) {
            additionalPartnerPublisher =
              shuffle(PUBLISHERS).find((name) => !usedPublishers.has(name)) || "";

            if (additionalPartnerPublisher) {
              usedPublishers.add(additionalPartnerPublisher);
            }
          }

          return {
            ...part,
            publisher: publisher || "",
            partnerPublisher,
            additionalPublisher,
            additionalPartnerPublisher,
          };
        });

        return next;
      })
    );
  };

  const clear = () => {
    setRows((current) =>
      current.map((row) => {
        const next = { ...row, bibleReading: "", bibleReadingAdditional: "" };

        APPOINTED_FIELDS.forEach(([field]) => {
          next[field] = "";
        });

        next.studentParts = row.studentParts.map((part) => ({
          ...part,
          publisher: "",
          partnerPublisher: "",
          additionalPublisher: "",
          additionalPartnerPublisher: "",
        }));

        return next;
      })
    );
  };

  const appointedSummary = useMemo(() => {
    const map = {};

    APPOINTED_BROTHERS.forEach((name) => {
      map[name] = {
        name,
        total: 0,
        lastDate: "",
        lastPart: "",
      };

      APPOINTED_FIELDS.forEach(([field]) => {
        map[name][field] = 0;
      });
    });

    rows.forEach((row) => {
      APPOINTED_FIELDS.forEach(([field]) => {
        const name = row[field];

        if (!name || !map[name]) return;

        map[name][field] += 1;
        map[name].total += 1;
        map[name].lastDate = row.tagalogDate || row.date;
        map[name].lastPart =
          APPOINTED_FIELDS.find(([partField]) => partField === field)?.[1] || "";
      });
    });

    return Object.values(map).sort(
      (a, b) => a.total - b.total || a.name.localeCompare(b.name)
    );
  }, [rows]);

  const publisherSummary = useMemo(() => {
    const map = {};

    ALL_ASSIGNMENT_NAMES.forEach((name) => {
      map[name] = {
        name,
        bibleReading: 0,
        startingConversation: 0,
        followingUp: 0,
        makingDisciples: 0,
        explainYourBelief: 0,
        talk: 0,
        total: 0,
        lastDate: "",
        lastPart: "",
      };
    });

    const addStudentPart = (name, type, date) => {
      if (!name || !map[name]) return;

      const englishType = STUDENT_TYPE_TO_ENGLISH[type] || type;

      const keyMap = {
        "Starting a Conversation": "startingConversation",
        "Following Up": "followingUp",
        "Making Disciples": "makingDisciples",
        "Explain Your Belief": "explainYourBelief",
        Talk: "talk",
      };

      const key = keyMap[englishType];

      if (!key) return;

      map[name][key] += 1;
      map[name].total += 1;
      map[name].lastDate = date;
      map[name].lastPart = type;
    };

    rows.forEach((row) => {
      if (row.bibleReading && map[row.bibleReading]) {
        map[row.bibleReading].bibleReading += 1;
        map[row.bibleReading].total += 1;
        map[row.bibleReading].lastDate = row.tagalogDate || row.date;
        map[row.bibleReading].lastPart = "Pagbabasa ng Bibliya";
      }

      if (row.bibleReadingAdditional && map[row.bibleReadingAdditional]) {
        map[row.bibleReadingAdditional].bibleReading += 1;
        map[row.bibleReadingAdditional].total += 1;
        map[row.bibleReadingAdditional].lastDate = row.tagalogDate || row.date;
        map[row.bibleReadingAdditional].lastPart = "Pagbabasa ng Bibliya (Karagdagang Klase)";
      }

      row.studentParts.forEach((part) => {
        addStudentPart(part.publisher, part.type, row.tagalogDate || row.date);
        addStudentPart(part.partnerPublisher, part.type, row.tagalogDate || row.date);
        addStudentPart(part.additionalPublisher, part.type, row.tagalogDate || row.date);
        addStudentPart(part.additionalPartnerPublisher, part.type, row.tagalogDate || row.date);
      });
    });

    return Object.values(map).sort(
      (a, b) => a.total - b.total || a.name.localeCompare(b.name)
    );
  }, [rows]);

  const publisherSummaryByGroup = useMemo(() => {
    const summaryMap = Object.fromEntries(
      publisherSummary.map((item) => [item.name, item])
    );

    return Object.entries(COMBINED_ASSIGNMENT_GROUPS).map(([group, names]) => ({
      group,
      publishers: names
        .map((name) => summaryMap[name])
        .filter(Boolean)
        .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name)),
    }));
  }, [publisherSummary]);

  const filteredAppointedSummary = useMemo(() => {
    const keyword = appointedSearch.trim().toLowerCase();

    if (!keyword) return appointedSummary;

    return appointedSummary.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
  }, [appointedSummary, appointedSearch]);

  const filteredPublisherSummary = useMemo(() => {
    const keyword = publisherSearch.trim().toLowerCase();

    if (!keyword) return publisherSummary;

    return publisherSummary.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
  }, [publisherSummary, publisherSearch]);

  return (
    <div className="section">
      <div className="toolbar">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Schedule title"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={autoFill}>Auto-fill</button>
        <button onClick={clear}>Clear</button>
      </div>

      <Tabs
        tabs={[
          {
            label: "Parts Table",
            content: (
              <div className="card scroll">
                <div className="bulk-sync-box">
                  <h3>Bulk Sync (Multiple Weeks)</h3>
                  <p className="helper-text">
                    Paste multiple JW workbook links, one per line. They will sync in order from the first Thursday row downward.
                  </p>
                  <textarea
                    value={bulkLinks}
                    onChange={(e) => setBulkLinks(e.target.value)}
                    placeholder="Paste one JW workbook link per line..."
                  />
                  <button onClick={handleBulkSync}>Sync All Weeks</button>
                </div>

                <h2>{title}</h2>

                <table className="wide-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Karagdagang Klase</th>
                      <th>Tagapayo sa Karagdagang Klase</th>
                      <th>Workbook Link</th>

                      {APPOINTED_FIELDS.map(([, label]) => (
                        <th key={label}>{label}</th>
                      ))}

                      <th>Pagbabasa ng Bibliya</th>

                      {Array.from({ length: MAX_STUDENT_PARTS }).map(
                        (_, index) => (
                          <th key={`student-${index}`}>
                            Bahagi {index + 1}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={`${row.date}-${rowIndex}`}>
                        <td>{row.tagalogDate || row.date}</td>

                        <td>
                          <select
                            value={row.meetingStatus || "normal"}
                            onChange={(e) =>
                              updateRow(rowIndex, "meetingStatus", e.target.value)
                            }
                          >
                            {MEETING_STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={row.additionalClassGroups || ""}
                            onChange={(e) =>
                              updateRow(rowIndex, "additionalClassGroups", e.target.value)
                            }
                          >
                            {ADDITIONAL_CLASS_GROUP_OPTIONS.map((group) => (
                              <option key={group || "none"} value={group}>
                                {group ? `Groups ${group}` : "None"}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={row.additionalClassCounselor || ""}
                            onChange={(e) =>
                              updateRow(rowIndex, "additionalClassCounselor", e.target.value)
                            }
                          >
                            <option value=""></option>
                            {ELDERS.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="sync-cell">
                          <input
                            value={row.workbookUrl || ""}
                            onChange={(e) =>
                              updateWorkbookUrl(rowIndex, e.target.value)
                            }
                            placeholder="Paste JW.org link"
                            className="row-sync-input"
                          />
                          <button onClick={() => syncWorkbookRow(rowIndex)}>
                            Sync
                          </button>
                          {row.syncStatus ? (
                            <div className="row-sync-status">
                              {row.syncStatus}
                            </div>
                          ) : null}
                        </td>

                        {APPOINTED_FIELDS.map(([field]) => (
                          <td key={field}>
                            {field === "reader" ? (
                              <PublisherSelect
                                value={row[field]}
                                onChange={(e) =>
                                  updateRow(rowIndex, field, e.target.value)
                                }
                                includeAppointed={true}
                              />
                            ) : (
                              <TheocraticSelect
                                value={row[field]}
                                onChange={(e) =>
                                  updateRow(rowIndex, field, e.target.value)
                                }
                              />
                            )}
                          </td>
                        ))}

                        <td>
                          <div className="hall-assignment-box">
                            <label>Karagdagang Klase</label>
                            <PublisherSelect
                              value={row.bibleReadingAdditional || ""}
                              onChange={(e) =>
                                updateRow(
                                  rowIndex,
                                  "bibleReadingAdditional",
                                  e.target.value
                                )
                              }
                            />

                            <label>Main Hall</label>
                            <PublisherSelect
                              value={row.bibleReading}
                              onChange={(e) =>
                                updateRow(
                                  rowIndex,
                                  "bibleReading",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </td>

                        {row.studentParts.map((part, partIndex) => (
                          <td
                            key={partIndex}
                            className={!part.type ? "inactive" : ""}
                          >
                            <select
                              value={part.type || ""}
                              onChange={(e) =>
                                updateStudentPart(
                                  rowIndex,
                                  partIndex,
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">—</option>
                              {STUDENT_PART_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>

                            {part.type ? (
                              <div className="hall-assignment-box">
                                <label>Karagdagang Klase</label>
                                <PublisherSelect
                                  value={part.additionalPublisher || ""}
                                  onChange={(e) =>
                                    updateStudentPart(
                                      rowIndex,
                                      partIndex,
                                      "additionalPublisher",
                                      e.target.value
                                    )
                                  }
                                />

                                {needsPartner(part.type) ? (
                                  <PublisherSelect
                                    value={part.additionalPartnerPublisher || ""}
                                    onChange={(e) =>
                                      updateStudentPart(
                                        rowIndex,
                                        partIndex,
                                        "additionalPartnerPublisher",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : null}

                                <label>Main Hall</label>
                                <PublisherSelect
                                  value={part.publisher}
                                  onChange={(e) =>
                                    updateStudentPart(
                                      rowIndex,
                                      partIndex,
                                      "publisher",
                                      e.target.value
                                    )
                                  }
                                />

                                {needsPartner(part.type) ? (
                                  <PublisherSelect
                                    value={part.partnerPublisher || ""}
                                    onChange={(e) =>
                                      updateStudentPart(
                                        rowIndex,
                                        partIndex,
                                        "partnerPublisher",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : null}
                              </div>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="print-toggle">
                  <button onClick={() => setShowPrintable((value) => !value)}>
                    {showPrintable
                      ? "Hide Printable Schedule"
                      : "Show Printable Schedule"}
                  </button>
                </div>

                {showPrintable ? <PrintableSchedule rows={rows} /> : null}
              </div>
            ),
          },
          {
            label: "Workbook Setup",
            content: (
              <div className="card">
                <p className="helper-text">
                  Manual backup: paste workbook text per date, then click Parse.
                  It can detect duplicate student parts.
                </p>

                {rows.map((row, rowIndex) => (
                  <div key={`workbook-${row.date}`} className="workbook-box">
                    <strong>{row.tagalogDate || row.date}</strong>

                    <textarea
                      value={workbookPaste[rowIndex] || ""}
                      onChange={(e) =>
                        setWorkbookPaste((current) => ({
                          ...current,
                          [rowIndex]: e.target.value,
                        }))
                      }
                      placeholder="Paste workbook text here..."
                    />

                    <button onClick={() => parseWorkbookText(rowIndex)}>
                      Parse
                    </button>
                  </div>
                ))}
              </div>
            ),
          },
          {
            label: "Appointed Balance",
            content: (
              <Tabs
                tabs={[
                  {
                    label: "Balance View",
                    content: (
                      <div className="card">
                        <div className="balance-grid">
                          {appointedSummary.map((item) => (
                            <BalanceCard
                              key={item.name}
                              name={item.name}
                              total={item.total}
                              lastDate={item.lastDate}
                              lastPart={item.lastPart}
                            />
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Detailed Summary",
                    content: (
                      <div className="card scroll">
                        <p className="helper-text">
                          This summary follows the selected month above. Use Last Date and Last Part to check when someone was assigned most recently.
                        </p>

                        <input
                          className="summary-search"
                          value={appointedSearch}
                          onChange={(e) => setAppointedSearch(e.target.value)}
                          placeholder="Search elder or ministerial servant..."
                        />

                        <table>
                          <thead>
                            <tr>
                              <th>Brother</th>
                              {APPOINTED_FIELDS.map(([, label]) => (
                                <th key={label}>{label}</th>
                              ))}
                              <th>Last Date</th>
                              <th>Last Part</th>
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredAppointedSummary.map((item) => (
                              <tr key={item.name} className={appointedSearch && item.name.toLowerCase().includes(appointedSearch.toLowerCase()) ? "search-match" : ""}>
                                <td>{item.name}</td>
                                {APPOINTED_FIELDS.map(([field]) => (
                                  <td key={field}>{item[field]}</td>
                                ))}
                                <td>{item.lastDate || "—"}</td>
                                <td>{item.lastPart || "—"}</td>
                                <td>
                                  <strong>{item.total}</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            label: "Publisher Balance",
            content: (
              <Tabs
                tabs={[
                  {
                    label: "Balance View",
                    content: (
                      <div className="card">
                        {publisherSummaryByGroup.map((group) => (
                          <div key={group.group} className="group-box">
                            <h3>{group.group}</h3>

                            <div className="balance-grid">
                              {group.publishers.map((publisher) => (
                                <BalanceCard
                                  key={publisher.name}
                                  name={publisher.name}
                                  total={publisher.total}
                                  lastDate={publisher.lastDate}
                                  lastPart={publisher.lastPart}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: "Detailed Summary",
                    content: (
                      <div className="card scroll">
                        <p className="helper-text">
                          This summary follows the selected month above. Use Last Date and Last Part to check when a publisher was assigned most recently.
                        </p>

                        <input
                          className="summary-search"
                          value={publisherSearch}
                          onChange={(e) => setPublisherSearch(e.target.value)}
                          placeholder="Search publisher..."
                        />

                        <table>
                          <thead>
                            <tr>
                              <th>Publisher</th>
                              <th>Pagbabasa ng Bibliya</th>
                              <th>Pagpapasimula</th>
                              <th>Pakikipag-usap Muli</th>
                              <th>Paggawa ng Alagad</th>
                              <th>Ipaliwanag Paniniwala</th>
                              <th>Pahayag</th>
                              <th>Last Date</th>
                              <th>Last Part</th>
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredPublisherSummary.map((item) => (
                              <tr key={item.name} className={publisherSearch && item.name.toLowerCase().includes(publisherSearch.toLowerCase()) ? "search-match" : ""}>
                                <td>{item.name}</td>
                                <td>{item.bibleReading}</td>
                                <td>{item.startingConversation}</td>
                                <td>{item.followingUp}</td>
                                <td>{item.makingDisciples}</td>
                                <td>{item.explainYourBelief}</td>
                                <td>{item.talk}</td>
                                <td>{item.lastDate || "—"}</td>
                                <td>{item.lastPart || "—"}</td>
                                <td>
                                  <strong>{item.total}</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [mainTab, setMainTab] = useState("av");

  return (
    <div className="app">
      <header>
        <h1>Kingdom Hall Scheduling System</h1>
        <p>AV technical scheduling and midweek theocratic parts balancing.</p>
      </header>

      <MainTabs active={mainTab} setActive={setMainTab} />

      {mainTab === "av" ? <AVScheduler /> : <TheocraticScheduler />}
    </div>
  );
}
