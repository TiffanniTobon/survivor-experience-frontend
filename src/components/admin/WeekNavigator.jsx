import { DAY_NAMES, toISODate, formatWeekRange } from "@/utils/classHelpers";
import useIsMobile from "@/hooks/useIsMobile";

export default function WeekNavigator({
  monday,
  weekDays,
  selectedDayIndex,
  classes,
  onPrevWeek,
  onNextWeek,
  onSelectDay,
}) {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Flechas + rango de semana */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={onPrevWeek}
          style={{
            background: "#0a2a2a",
            border: "1px solid #1a4a4a",
            color: "#00e5ff",
            borderRadius: 6,
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ‹
        </button>

        <span
          style={{
            color: "#e0f7fa",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: isMobile ? 13 : 15,
            letterSpacing: 1,
            fontWeight: 600,
            flex: 1,
            textAlign: "center",
          }}
        >
          {formatWeekRange(monday)}
        </span>

        <button
          onClick={onNextWeek}
          style={{
            background: "#0a2a2a",
            border: "1px solid #1a4a4a",
            color: "#00e5ff",
            borderRadius: 6,
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Selector de días */}
      <div style={{ display: "flex", gap: isMobile ? 4 : 8, marginBottom: 24 }}>
        {weekDays.map((day, i) => {
          const isSelected = i === selectedDayIndex;
          const hasClasses = classes.some((c) => c.date === toISODate(day));

          return (
            <button
              key={i}
              onClick={() => onSelectDay(i)}
              style={{
                flex: 1,
                padding: isMobile ? "8px 4px" : "12px 8px",
                borderRadius: 8,
                border: isSelected ? "1px solid #00e5ff" : "1px solid #0a2a2a",
                background: isSelected ? "#00e5ff" : "#060f0f",
                color: isSelected
                  ? "#040d0d"
                  : hasClasses
                    ? "#00e5ff"
                    : "#336666",
                cursor: "pointer",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? 8 : 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                lineHeight: 1.6,
                transition: "all 0.15s",
              }}
            >
              <div>{DAY_NAMES[i]}</div>
              <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 900 }}>
                {day.getDate()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
