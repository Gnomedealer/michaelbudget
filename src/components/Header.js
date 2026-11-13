import { currentMonth, formatMonth, shiftMonth } from "../utils/dates";

function Header({ month, onMonthChange }) {
  const isCurrent = month === currentMonth();

  return (
    <header className="app-header">
      <div className="container header-inner">
        <h1 className="logo">
          <span className="logo-mark" aria-hidden="true">$</span>
          Michael's Money Tracker
        </h1>

        <div className="month-nav">
          <button
            className="icon-btn"
            aria-label="Previous month"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
          >
            ‹
          </button>
          <span className="month-label">{formatMonth(month)}</span>
          <button
            className="icon-btn"
            aria-label="Next month"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
          >
            ›
          </button>
          {!isCurrent && (
            <button className="btn btn-ghost btn-small" onClick={() => onMonthChange(currentMonth())}>
              Today
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
