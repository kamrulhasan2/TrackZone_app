import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ALL_TIMEZONE_OFFSET } from "../../../constants/timezone";
import { 
  User, 
  Sliders, 
  MapPin, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Info 
} from "lucide-react";

const WorkspaceSettingsView = ({
  clocks,
  setClocks,
  localClock,
  setLocalClock,
  eventsManager,
  profileName,
  setProfileName,
  profileInitials,
  setProfileInitials,
  showLivePulse,
  setShowLivePulse,
  showOffsetBadge,
  setShowOffsetBadge
}) => {
  // Local states for inputs to avoid laggy updates
  const [nameInput, setNameInput] = useState(profileName);
  const [initialsInput, setInitialsInput] = useState(profileInitials);
  
  const [primaryTitleInput, setPrimaryTitleInput] = useState(localClock.title || "My Clock");
  const [primaryTimezoneSelect, setPrimaryTimezoneSelect] = useState(localClock.timezone || "UTC");

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save profile changes
  const handleSaveProfile = useCallback((e) => {
    e.preventDefault();
    setProfileName(nameInput);
    setProfileInitials(initialsInput);
    triggerSuccessBanner();
  }, [nameInput, initialsInput, setProfileName, setProfileInitials]);

  // Save primary clock changes
  const handleSavePrimaryLocation = useCallback((e) => {
    e.preventDefault();
    setLocalClock(prev => ({
      ...prev,
      title: primaryTitleInput,
      timezone: primaryTimezoneSelect
    }));
    triggerSuccessBanner();
  }, [primaryTitleInput, primaryTimezoneSelect, setLocalClock]);

  const triggerSuccessBanner = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Delete all clocks and clear event registry
  const handleResetWorkspace = useCallback(() => {
    // Delete all events
    if (eventsManager && eventsManager.events) {
      Object.keys(eventsManager.events).forEach(key => {
        eventsManager.deleteEvent(key);
      });
    }
    // Delete secondary clocks
    setClocks([]);
    // Reset local clock
    setLocalClock({
      id: "local",
      title: "My Clock",
      timezone: "UTC",
      offset: 0,
      date: null
    });
    // Reset inputs
    setNameInput("John Doe");
    setInitialsInput("JD");
    setPrimaryTitleInput("My Clock");
    setPrimaryTimezoneSelect("UTC");
    
    // Reset visual preferences
    setProfileName("John Doe");
    setProfileInitials("JD");
    setShowLivePulse(true);
    setShowOffsetBadge(true);
    
    setResetDialogOpen(false);
  }, [setClocks, setLocalClock, eventsManager, setProfileName, setProfileInitials, setShowLivePulse, setShowOffsetBadge]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg p-3 text-xs font-semibold animate-in fade-in duration-200">
          <Check className="h-4 w-4" />
          <span>Workspace preferences saved successfully!</span>
        </div>
      )}

      {/* User Profile Settings Block */}
      <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6">
        <div className="flex items-center space-x-2 border-b border-border/40 pb-3 mb-5">
          <User className="h-4.5 w-4.5 text-muted-foreground" />
          <h3 className="text-md font-bold text-foreground">User Profile Settings</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="profileName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Name
              </Label>
              <Input 
                id="profileName"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. John Doe"
                className="bg-background border-border/80 h-9"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="profileInitials" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Initials
              </Label>
              <Input 
                id="profileInitials"
                type="text"
                maxLength="3"
                value={initialsInput}
                onChange={(e) => setInitialsInput(e.target.value.toUpperCase())}
                placeholder="e.g. JD"
                className="bg-background border-border/80 h-9"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="font-semibold text-xs h-8">
              Update Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Primary Location / Clock Settings Block */}
      <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6">
        <div className="flex items-center space-x-2 border-b border-border/40 pb-3 mb-5">
          <MapPin className="h-4.5 w-4.5 text-muted-foreground" />
          <h3 className="text-md font-bold text-foreground">Primary Location Settings</h3>
        </div>

        <form onSubmit={handleSavePrimaryLocation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="primaryTitle" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Primary Location Title
              </Label>
              <Input 
                id="primaryTitle"
                type="text"
                value={primaryTitleInput}
                onChange={(e) => setPrimaryTitleInput(e.target.value)}
                placeholder="e.g. Dhaka HQ, London Office"
                className="bg-background border-border/80 h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="primaryTimezone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Primary Location Timezone
              </Label>
              <Select value={primaryTimezoneSelect} onValueChange={setPrimaryTimezoneSelect}>
                <SelectTrigger id="primaryTimezone" className="w-full bg-background border-border/80 h-9">
                  <SelectValue placeholder="Select primary timezone" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_TIMEZONE_OFFSET.map(timezone => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="font-semibold text-xs h-8">
              Save Location
            </Button>
          </div>
        </form>
      </div>

      {/* Preference Toggles Block */}
      <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6">
        <div className="flex items-center space-x-2 border-b border-border/40 pb-3 mb-5">
          <Sliders className="h-4.5 w-4.5 text-muted-foreground" />
          <h3 className="text-md font-bold text-foreground">Workspace Preferences</h3>
        </div>

        <div className="divide-y divide-border/40 space-y-4">
          {/* Live Pulse Toggle */}
          <div className="flex items-center justify-between py-2 text-left">
            <div>
              <div className="text-sm font-semibold text-foreground">Live Clock Pulse Pulse</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Show active green radar pulsing indicator on the primary clock.</div>
            </div>
            
            <button 
              onClick={() => setShowLivePulse(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                showLivePulse 
                  ? "bg-primary text-primary-foreground border-primary shadow" 
                  : "bg-secondary text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              {showLivePulse ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Comparative Offset Toggle */}
          <div className="flex items-center justify-between pt-4 pb-2 text-left">
            <div>
              <div className="text-sm font-semibold text-foreground">Comparative Offset Badges</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Display time differences relative to your primary timezone on tracked cards.</div>
            </div>
            
            <button 
              onClick={() => setShowOffsetBadge(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                showOffsetBadge 
                  ? "bg-primary text-primary-foreground border-primary shadow" 
                  : "bg-secondary text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              {showOffsetBadge ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone Block */}
      <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-6">
        <div className="flex items-center space-x-2 border-b border-destructive/15 pb-3 mb-5">
          <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
          <h3 className="text-md font-bold text-destructive">Danger Zone</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
          <div>
            <div className="text-sm font-semibold text-foreground">Reset Workspace Data</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Permanently purges all secondary timezone clocks, deletes the events agenda database, and resets profile configuration.
            </p>
          </div>

          <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="font-semibold text-xs h-8">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Reset Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Confirm Workspace Reset</span>
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground leading-normal py-3">
                This action is irreversible. It will wipe out all tracked clocks and purge the entire event calendar database. Please confirm you want to proceed.
              </p>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setResetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleResetWorkspace}>
                  Delete Workspace Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

    </div>
  );
};

export default WorkspaceSettingsView;
