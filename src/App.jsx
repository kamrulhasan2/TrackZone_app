import { useState, useCallback, useEffect } from "react"
import ClockList from "./components/clock-list"
import LocalClock from "./components/local-clock"
import CalendarView from "./components/shared/calendar-view/CalendarView"
import useEvents from "./hooks/useEvents"
import { generate } from "shortid";
import { 
  Globe, 
  Clock, 
  Settings, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Calendar, 
  ChevronDown 
} from "lucide-react";

const LOCAL_CLOCK_INIT = {
  id: "local",
  title: 'My Clock',
  timezone: '',
  offset: 0,
  date: null,
};

const App = () => {
  const [localClock, setLocalClock] = useState({ ...LOCAL_CLOCK_INIT });
  const [clocks, setClocks] = useState([]);
  
  // Lifted events manager
  const eventsManager = useEvents();

  // Navigation tab switcher state
  const [activeView, setActiveView] = useState("dashboard");

  // Theme state & persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("trackzone-theme") || "light";
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("trackzone-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, []);

  const upDateLocalClock = useCallback((data) => {
    setLocalClock(prevClock => ({
      ...prevClock,
      ...data,
    }));
  }, []);

  const createClock = useCallback((clock) => {
    const newClock = { ...clock, id: generate() };
    setClocks(prevClocks => [...prevClocks, newClock]);
  }, []);

  const updateClock = useCallback((updatedClock) => {
    setClocks(prevClocks => 
      prevClocks.map((clock) => 
        clock.id === updatedClock.id ? updatedClock : clock
      )
    );
  }, []);

  const deleteClock = useCallback((id) => {
    setClocks(prevClocks => prevClocks.filter((clock) => clock.id !== id));
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-card/50 backdrop-blur-sm p-5 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2">
            <img src="/Track2one.png" alt="TrackZone" className="h-8 w-auto rounded" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              TrackZone
            </span>
            <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase tracking-wider">
              Beta
            </span>
          </div>

          {/* Workspace Switcher Mock */}
          <div className="w-full">
            <button className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border/40 text-left hover:bg-secondary transition duration-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  TZ
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground leading-none">Personal Space</div>
                  <div className="text-[10px] text-muted-foreground">Free Tier</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Sidebar Nav */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveView("dashboard")}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ${
                activeView === "dashboard" 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveView("calendar")}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ${
                activeView === "calendar" 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Events Calendar</span>
            </button>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-200">
              <Globe className="h-4 w-4" />
              <span>Timezones list</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-200">
              <Settings className="h-4 w-4" />
              <span>Workspace Settings</span>
            </a>
          </nav>
        </div>

        {/* System Status pulse */}
        <div className="pt-4 border-t border-border/55">
          <div className="flex items-center space-x-2 px-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All systems nominal</span>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src="/Track2one.png" alt="TrackZone" className="h-6 w-auto" />
                  <span className="font-bold text-md">TrackZone</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="w-full">
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-secondary/50 border border-border/40">
                  <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    TZ
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Personal Space</div>
                    <div className="text-[10px] text-muted-foreground">Free Tier</div>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveView("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    activeView === "dashboard" 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => { setActiveView("calendar"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    activeView === "calendar" 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Events Calendar</span>
                </button>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Timezones list</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span>Workspace Settings</span>
                </a>
              </nav>
            </div>

            <div className="pt-4 border-t border-border/55">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>All systems nominal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 rounded-md md:hidden hover:bg-muted text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-muted-foreground">
              <span>Personal Space</span>
              <span className="text-border">/</span>
              <span>Clocks</span>
              <span className="text-border">/</span>
              <span className="text-foreground capitalize">{activeView === "dashboard" ? "Dashboard" : "Events Calendar"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Command Search Mockup */}
            <button className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground bg-secondary/80 border border-border/40 rounded-lg px-3 py-1.5 w-44 hover:bg-secondary hover:text-foreground transition-all duration-200">
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium opacity-100">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition duration-200">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
            </button>

            {/* User Profile Avatar Mockup */}
            <div className="flex items-center space-x-2 pl-2 border-l border-border/60">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-background ring-offset-2 ring-offset-primary/10">
                JD
              </div>
              <span className="hidden lg:inline text-xs font-semibold">John Doe</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 container mx-auto px-6 py-8 space-y-8 max-w-7xl">
          
          {/* Dashboard Title Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {activeView === "dashboard" ? "TrackZone Dashboard" : "Scheduled Events Calendar"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeView === "dashboard" 
                  ? "Real-time world clock coordinator and event scheduler." 
                  : "Organize, schedule, and coordinate cross-timezone calendar events."}
              </p>
            </div>
            
            {/* Development Version Alert */}
            <div className="flex items-center space-x-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg p-3 max-w-md">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <div className="text-xs">
                <span className="font-semibold">[Beta Version]</span> This site is under construction. Stable version will release soon.
              </div>
            </div>
          </div>

          {/* Conditional View Rendering */}
          {activeView === "dashboard" ? (
            <div className="space-y-8 animate-in fade-in-50 duration-200">
              {/* Local clock / primary region */}
              <div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Primary timezone</h2>
                <LocalClock 
                  clock={localClock}
                  updateClock={upDateLocalClock} 
                  createClock={createClock}
                  deleteClock={deleteClock}
                />
              </div>

              {/* Clock List region */}
              <div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Secondary trackings</h2>
                <ClockList 
                  clocks={clocks}
                  updateClock={updateClock}
                  deleteClock={deleteClock}
                  localClock={localClock.date}
                  eventsManager={eventsManager}
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in-50 duration-200">
              <CalendarView 
                clocks={clocks}
                localClock={localClock}
                eventsManager={eventsManager}
              />
            </div>
          )}
          
        </main>
      </div>

    </div>
  )
}

export default App;