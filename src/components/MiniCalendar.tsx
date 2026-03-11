import { useState } from "react";

const DAYS_ABBR = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function MiniCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = current.getFullYear();
  const month = current.getMonth();
  const evDays = new Set([8, 13, 20, 27]);

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ d: daysInPrev - i, other: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ d });
  }

  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) {
    cells.push({ d, other: true });
  }

  return (
    <div>
      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          marginBottom:16
        }}
      >
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          style={{
            background:"none",
            border:"none",
            color:"var(--text-muted)",
            cursor:"pointer",
            fontSize:18
          }}
        >
          ‹
        </button>

        <span style={{ fontWeight:700, fontSize:15 }}>
          {MONTHS[month]} {year}
        </span>

        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          style={{
            background:"none",
            border:"none",
            color:"var(--text-muted)",
            cursor:"pointer",
            fontSize:18
          }}
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {DAYS_ABBR.map((d) => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}

        {cells.map((c, i) => (
          <div
            key={i}
            className={[
              "cal-day",
              c.other ? "other-month" : "",
              !c.other && c.d === today.getDate() && month === today.getMonth()
                ? "today"
                : "",
              !c.other && evDays.has(c.d)
                ? "has-event"
                : ""
            ].join(" ")}
          >
            {c.d}
          </div>
        ))}
      </div>
    </div>
  );
}