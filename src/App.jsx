import React, { useEffect, useMemo, useState } from "react";
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
    attendant: "",
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
        studentParts: [
          { type: "Pagpapasimula ng Pakikipag-usap", publisher: "" },
          { type: "Pakikipag-usap Muli", publisher: "" },
          { type: "Paggawa ng mga Alagad", publisher: "" },
          { type: index === 0 ? "Pahayag" : "", publisher: "" },
          { type: "", publisher: "" },
        ],
        workbook: {
          weekTitle: "",
          bibleChapters: "",
          songs: {
            opening: "",
            middle: "",
            closing: "",
          },
          treasuresTitle: "",
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

function PublisherSelect({ value, onChange }) {
  return (
    <select value={value || ""} onChange={onChange}>
      <option value=""></option>

      {Object.entries(PUBLISHER_GROUPS).map(([group, names]) => (
        <optgroup key={group} label={group}>
          {names.map((name) => (
            <option key={`${group}-${name}`} value={name}>
              {name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function BalanceCard({ name, total }) {
  return (
    <div className={`balance-card ${countColor(total)}`}>
      <strong>{name}</strong>
      <span>Total: {total}</span>
    </div>
  );
}

/* =========================================================
   PRINTABLE SCHEDULE COMPONENT
   ========================================================= */

function PrintableSchedule({ rows }) {
  return (
    <div className="printable-area">
      <div className="print-actions">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      {rows.map((row, index) => {
        if (row.meetingStatus && row.meetingStatus !== "normal") {
          return (
            <div key={`${row.date}-${index}`} className="print-page">
              <div className="print-header">
                <div>
                  <h2>Iskedyul ng Pulong Para sa Buhay at Ministeryo</h2>
                  <p>{row.workbook?.weekTitle || row.date}</p>
                </div>
                <div className="print-date-box">{row.date}</div>
              </div>

              <div className="no-meeting-print">
                <h2>WALANG PULONG SA GITNANG SANLINGGO</h2>
                <p>{getStatusLabel(row.meetingStatus)}</p>
              </div>
            </div>
          );
        }

        return (
        <div key={`${row.date}-${index}`} className="print-page">
          <div className="print-header">
            <div>
              <h2>Iskedyul ng Pulong Para sa Buhay at Ministeryo</h2>
              <p>{row.workbook?.weekTitle || row.date}</p>
            </div>
            <div className="print-date-box">{row.date}</div>
          </div>

          <table className="bethel-table">
            <tbody>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Chairman</td>
                <td className="name-cell">{row.chairman}</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Pambukas na Panalangin</td>
                <td className="name-cell">{row.openingPrayer}</td>
              </tr>
              <tr className="section-blue">
                <td colSpan="3">KAYAMANAN MULA SA SALITA NG DIYOS</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">
                  {row.workbook?.treasuresTitle || "Kayamanan sa Salita ng Diyos"}
                </td>
                <td className="name-cell">{row.treasuresTalk}</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Espirituwal na Hiyas</td>
                <td className="name-cell">{row.spiritualGems}</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Pagbabasa ng Bibliya</td>
                <td className="name-cell">{row.bibleReading}</td>
              </tr>

              <tr className="section-gold">
                <td colSpan="3">MAGING MAHUSAY SA MINISTERYO</td>
              </tr>

              {row.studentParts
                .filter((part) => part.type)
                .map((part, partIndex) => (
                  <tr key={`${row.date}-student-${partIndex}`}>
                    <td className="time-cell"></td>
                    <td className="label-cell">{part.type}</td>
                    <td className="name-cell">{part.publisher}</td>
                  </tr>
                ))}

              <tr className="section-red">
                <td colSpan="3">PAMUMUHAY BILANG KRISTIYANO</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Pamumuhay Bilang Kristiyano</td>
                <td className="name-cell">{row.livingAsChristians}</td>
              </tr>

              {(row.workbook?.livingParts || []).map((part, partIndex) => (
                <tr key={`${row.date}-living-${partIndex}`}>
                  <td className="time-cell"></td>
                  <td className="label-cell">{part}</td>
                  <td className="name-cell"></td>
                </tr>
              ))}

              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Pag-aaral ng Kongregasyon sa Bibliya</td>
                <td className="name-cell">{row.cbs}</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Reader</td>
                <td className="name-cell">{row.reader}</td>
              </tr>
              <tr>
                <td className="time-cell"></td>
                <td className="label-cell">Pangwakas na Panalangin</td>
                <td className="name-cell">{row.closingPrayer}</td>
              </tr>
            </tbody>
          </table>
        </div>
        );
      })}
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

  const summary = useMemo(() => {
    const map = {};

    AV_BROTHERS.forEach((name) => {
      map[name] = {
        name,
        sound: 0,
        mic1: 0,
        mic2: 0,
        stage: 0,
        attendant: 0,
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
      add(row.attendant, "attendant");
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
      </div>

      <Tabs
        tabs={[
          {
            label: "AV Table",
            content: (
              <div className="card scroll">
                <h2>{title}</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th colSpan="2">Sound System</th>
                      <th>Mic Roving 1</th>
                      <th>Mic Roving 2</th>
                      <th>Stage Platform</th>
                      <th>Attendant</th>
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
                          <input
                            value={row.attendant}
                            onChange={(e) =>
                              updateRow(index, "attendant", e.target.value)
                            }
                          />
                        </td>
                        <td>{row.notes}</td>
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
                      <th>Attendant</th>
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
                        <td>{item.attendant}</td>
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

        const studentParts = row.studentParts.map((part, pIndex) =>
          pIndex === partIndex ? { ...part, [field]: value } : part
        );

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

  const syncWorkbookRow = async (rowIndex) => {
    const row = rows[rowIndex];
    const url = row?.workbookUrl?.trim();

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
              treasuresTitle:
                week.treasuresTitle || item.workbook?.treasuresTitle || "",
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

        next.studentParts = next.studentParts.map((part) => {
          if (!part.type) return { ...part, publisher: "" };

          const chosen = shuffle(PUBLISHERS).find(
            (name) => !usedPublishers.has(name)
          );

          if (chosen) {
            usedPublishers.add(chosen);
          }

          return { ...part, publisher: chosen || "" };
        });

        return next;
      })
    );
  };

  const clear = () => {
    setRows((current) =>
      current.map((row) => {
        const next = { ...row, bibleReading: "" };

        APPOINTED_FIELDS.forEach(([field]) => {
          next[field] = "";
        });

        next.studentParts = row.studentParts.map((part) => ({
          ...part,
          publisher: "",
        }));

        return next;
      })
    );
  };

  const appointedSummary = useMemo(() => {
    const map = {};

    APPOINTED_BROTHERS.forEach((name) => {
      map[name] = { name, total: 0 };

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
      });
    });

    return Object.values(map).sort(
      (a, b) => a.total - b.total || a.name.localeCompare(b.name)
    );
  }, [rows]);

  const publisherSummary = useMemo(() => {
    const map = {};

    PUBLISHERS.forEach((name) => {
      map[name] = {
        name,
        bibleReading: 0,
        startingConversation: 0,
        followingUp: 0,
        makingDisciples: 0,
        explainYourBelief: 0,
        talk: 0,
        total: 0,
      };
    });

    const addStudentPart = (name, type) => {
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
    };

    rows.forEach((row) => {
      if (row.bibleReading && map[row.bibleReading]) {
        map[row.bibleReading].bibleReading += 1;
        map[row.bibleReading].total += 1;
      }

      row.studentParts.forEach((part) => {
        addStudentPart(part.publisher, part.type);
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

    return Object.entries(PUBLISHER_GROUPS).map(([group, names]) => ({
      group,
      publishers: names
        .map((name) => summaryMap[name])
        .filter(Boolean)
        .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name)),
    }));
  }, [publisherSummary]);

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
                <h2>{title}</h2>

                <table className="wide-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
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
                        <td>{row.date}</td>

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
                            <TheocraticSelect
                              value={row[field]}
                              onChange={(e) =>
                                updateRow(rowIndex, field, e.target.value)
                              }
                            />
                          </td>
                        ))}

                        <td>
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
                    <strong>{row.date}</strong>

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
                        <table>
                          <thead>
                            <tr>
                              <th>Brother</th>
                              {APPOINTED_FIELDS.map(([, label]) => (
                                <th key={label}>{label}</th>
                              ))}
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {appointedSummary.map((item) => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                {APPOINTED_FIELDS.map(([field]) => (
                                  <td key={field}>{item[field]}</td>
                                ))}
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
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {publisherSummary.map((item) => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>{item.bibleReading}</td>
                                <td>{item.startingConversation}</td>
                                <td>{item.followingUp}</td>
                                <td>{item.makingDisciples}</td>
                                <td>{item.explainYourBelief}</td>
                                <td>{item.talk}</td>
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
