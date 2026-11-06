import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Users, 
  Sparkles, 
  Shield, 
  Trash2, 
  Plus, 
  Check,
  Film,
  Archive,
  RotateCcw,
  Calendar,
  AlertTriangle,
  History,
  Trophy,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { TriviaGame, ArchivedSeason } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  exportGamesToJSON, 
  importGamesFromJSON, 
  getArchivedSeasons,
  archiveCurrentSeason,
  restoreArchiveToActive,
  deleteArchivedSeason,
  TRANSCRIBED_2026_GAMES,
  YEAR_2026_POSTER_ARTWORK
} from '../services/storage';
import YearLedgerModal from './YearLedgerModal';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: TriviaGame[];
  onGamesUpdated: (games: TriviaGame[]) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  teamLogo: string;
  setTeamLogo: (logo: string) => void;
  onOpenWrapped: () => void;
}

const DEFAULT_ROSTER: TeamMember[] = [
  { id: '1', name: 'Kevin', role: 'Vibe maker' },
  { id: '2', name: 'Amanda', role: 'CAmanda in Chief' },
  { id: '3', name: 'Dave', role: 'Pop Culture Specialist' },
  { id: '4', name: 'Elena', role: 'History & Geography Anchor' }
];

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({
  isOpen,
  onClose,
  games,
  onGamesUpdated,
  teamName,
  setTeamName,
  teamLogo,
  setTeamLogo,
  onOpenWrapped
}) => {
  const [currentTab, setCurrentTab] = useState<'team' | 'past-years' | 'roster' | 'data'>('past-years');
  const [tempName, setTempName] = useState(teamName);
  const [tempLogo, setTempLogo] = useState(teamLogo);
  const [archiveLabel, setArchiveLabel] = useState(`${new Date().getFullYear()} Season`);
  const [archivedSeasons, setArchivedSeasons] = useState<ArchivedSeason[]>([]);
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);
  const [selectedLedgerArchive, setSelectedLedgerArchive] = useState<ArchivedSeason | null>(null);
  
  const [roster, setRoster] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('trivia_team_roster');
    return saved ? JSON.parse(saved) : DEFAULT_ROSTER;
  });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setArchivedSeasons(getArchivedSeasons());
      setArchiveLabel(`${new Date().getFullYear()} Season`);
      setShowConfirmArchive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveTeamInfo = () => {
    setTeamName(tempName.trim() || 'Trivia Kings');
    localStorage.setItem('trivia_team_name', tempName.trim() || 'Trivia Kings');
    setTeamLogo(tempLogo);
    localStorage.setItem('trivia_team_logo', tempLogo);
    toast.success('Team profile updated!');
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const updated = [
        ...roster,
        { id: crypto.randomUUID(), name: newMemberName.trim(), role: newMemberRole.trim() || 'Trivia Ace' }
      ];
      setRoster(updated);
      localStorage.setItem('trivia_team_roster', JSON.stringify(updated));
      setNewMemberName('');
      setNewMemberRole('');
      toast.success('Team member added');
    }
  };

  const handleDeleteMember = (id: string) => {
    const updated = roster.filter(m => m.id !== id);
    setRoster(updated);
    localStorage.setItem('trivia_team_roster', JSON.stringify(updated));
  };

  // Archive current season and start fresh
  const handleExecuteArchive = () => {
    if (games.length === 0) {
      toast.error('No active games to archive');
      return;
    }

    const result = archiveCurrentSeason(games, archiveLabel, teamName);
    if (result.success) {
      setArchivedSeasons(getArchivedSeasons());
      onGamesUpdated([]);
      setShowConfirmArchive(false);
      toast.success(`Archived ${result.archive.gamesCount} games! Starting fresh for the new year.`);
    }
  };

  // Restore an archived season to active
  const handleRestoreArchive = (archive: ArchivedSeason) => {
    if (confirm(`Restore "${archive.label}" (${archive.gamesCount} games) to your active dashboard?`)) {
      const restored = restoreArchiveToActive(archive.id);
      if (restored) {
        onGamesUpdated(restored);
        toast.success(`Active season restored to "${archive.label}"`);
      }
    }
  };

  // Apply the transcribed 33 screenshot games directly to active
  const handleApplyTranscribedGames = () => {
    if (confirm(`Load all 33 games transcribed from your screenshots into your active dashboard?`)) {
      onGamesUpdated(TRANSCRIBED_2026_GAMES);
      toast.success('All 33 games loaded into active dashboard!');
    }
  };

  // Delete an archived season
  const handleDeleteArchive = (id: string) => {
    if (confirm('Delete this archived season record?')) {
      deleteArchivedSeason(id);
      setArchivedSeasons(getArchivedSeasons());
      toast.success('Archive removed');
    }
  };

  const handleDownloadTranscribedJSON = () => {
    exportGamesToJSON(TRANSCRIBED_2026_GAMES, `${teamName}_2026_season_screenshots`);
    toast.success('Downloaded 33-game JSON file!');
  };

  const handleExportActive = () => {
    exportGamesToJSON(games, `${teamName}_active_season`);
    toast.success('Active database backup exported to JSON');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info('Restoring database...');
    const result = await importGamesFromJSON(file);
    if (result.success && result.games) {
      onGamesUpdated(result.games);
      toast.success(`Successfully restored ${result.count} trivia games!`);
    } else {
      toast.error('Restore failed', { description: result.message });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Bar */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 tracking-tight">Team Hub & Settings</h2>
              <p className="text-xs text-zinc-400">Past years archives, team profile, and backup</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-6 pt-3 flex gap-1 border-b border-zinc-800/80 bg-zinc-950/40 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setCurrentTab('past-years')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              currentTab === 'past-years'
                ? 'text-amber-400 border-amber-500 bg-zinc-900/60 font-bold'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            Past Years ({archivedSeasons.length})
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('team')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              currentTab === 'team'
                ? 'text-indigo-400 border-indigo-500 bg-zinc-900/60 font-bold'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            Team Identity
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('roster')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              currentTab === 'roster'
                ? 'text-indigo-400 border-indigo-500 bg-zinc-900/60 font-bold'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            Roster ({roster.length})
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('data')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              currentTab === 'data'
                ? 'text-indigo-400 border-indigo-500 bg-zinc-900/60 font-bold'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            Backup & Reset
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* TAB 1: Past Years History & Visual Artwork Cards */}
          {currentTab === 'past-years' && (
            <div className="space-y-5">
              
              {/* Screenshot JSON File Download & Instant Import Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Screenshot Data Ready
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100">
                      2026 Season Import File (33 Games)
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Transcribed directly from your screenshots: all 33 games (Jan 21 to Nov 4, 2026, including Oct 28) with scores, ranks, and custom emoji vibes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <Button
                    type="button"
                    onClick={handleDownloadTranscribedJSON}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold h-9 rounded-xl shadow-md shadow-amber-500/20"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download JSON File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyTranscribedGames}
                    className="w-full border-amber-500/40 bg-zinc-900 hover:bg-zinc-800 text-amber-300 text-xs font-semibold h-9 rounded-xl"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Apply 33 Games to Dashboard
                  </Button>
                </div>
              </div>

              {/* Visual Year Cards with Artwork */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Past Years Visual Archives
                  </Label>
                  <span className="text-[11px] text-zinc-500">
                    {archivedSeasons.length} {archivedSeasons.length === 1 ? 'Season' : 'Seasons'}
                  </span>
                </div>

                {archivedSeasons.map((archive) => {
                  const wins = archive.games.filter(g => g.place === 1).length;
                  const highest = archive.games.length > 0 ? Math.max(...archive.games.map(g => g.score)) : 0;
                  const podiums = archive.games.filter(g => g.place && g.place <= 3).length;

                  return (
                    <div 
                      key={archive.id}
                      className="group rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl transition-all hover:border-zinc-700"
                    >
                      {/* Artwork Cover Header */}
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-900">
                        {archive.artworkUrl ? (
                          <img 
                            src={archive.artworkUrl} 
                            alt={`${archive.label} Artwork`} 
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <Trophy className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                        
                        {/* Overlay Titles */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                              Archived Season
                            </span>
                            <h3 className="text-xl font-black text-white tracking-tight mt-1 drop-shadow-md">
                              {archive.label}
                            </h3>
                          </div>
                          
                          <span className="text-xs font-mono font-bold text-zinc-300 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-zinc-700/50">
                            {archive.gamesCount} Games
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Stats */}
                      <div className="p-4 space-y-3.5">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                            <span className="text-[10px] text-zinc-400 block font-medium">Victories</span>
                            <strong className="text-sm font-bold font-mono text-amber-400">{wins} 🥇</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                            <span className="text-[10px] text-zinc-400 block font-medium">Podiums</span>
                            <strong className="text-sm font-bold font-mono text-zinc-200">{podiums}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                            <span className="text-[10px] text-zinc-400 block font-medium">Peak Score</span>
                            <strong className="text-sm font-bold font-mono text-zinc-100">{highest.toFixed(1)}/60</strong>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            type="button"
                            onClick={() => setSelectedLedgerArchive(archive)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9 rounded-xl shadow-md shadow-indigo-600/20 gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> View Game Ledger
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => exportGamesToJSON(archive.games, `${teamName}_${archive.label}`)}
                            className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs h-9 px-3 rounded-xl"
                            title="Download JSON File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRestoreArchive(archive)}
                            className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs h-9 px-3 rounded-xl"
                            title="Restore as Active Season"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Team Identity */}
          {currentTab === 'team' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300">Team Name</Label>
                <Input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Quizzspicable Me!"
                  className="bg-zinc-950/80 border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300">Team Icon / Logo URL</Label>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {tempLogo ? (
                      <img src={tempLogo} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🍺</span>
                    )}
                  </div>
                  <Input
                    type="text"
                    value={tempLogo}
                    onChange={(e) => setTempLogo(e.target.value)}
                    placeholder="Image URL or path..."
                    className="bg-zinc-950/80 border-zinc-800 text-zinc-100 flex-1 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveTeamInfo}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save Team Details
                </Button>
              </div>

              {/* Wrapped Instant Test Action */}
              <div className="pt-4 border-t border-zinc-800/80">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-950/30 border border-indigo-800/40 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-indigo-400" /> Trivia Wrapped Video
                    </span>
                    <p className="text-[11px] text-zinc-400">Preview the annual animated stats story</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenWrapped();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0"
                  >
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Roster */}
          {currentTab === 'roster' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Member name..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-zinc-950/80 border-zinc-800 text-zinc-100 flex-1 text-xs"
                />
                <Input
                  type="text"
                  placeholder="Role (e.g. Captain)..."
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="bg-zinc-950/80 border-zinc-800 text-zinc-100 flex-1 text-xs"
                />
                <Button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {roster.map((m) => (
                  <div 
                    key={m.id} 
                    className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/70 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{m.name}</h4>
                      <p className="text-[11px] text-zinc-500">{m.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(m.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Backup & Reset */}
          {currentTab === 'data' && (
            <div className="space-y-5">
              
              {/* Archive Current Season & Start Fresh */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                      <Archive className="w-3.5 h-3.5 text-amber-400" /> Archive Season & Start Fresh
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Saves your active {games.length} games to the Past Years archives, downloads a JSON file backup to your device, and resets active games to 0 for a new year.
                    </p>
                  </div>
                </div>

                {!showConfirmArchive ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">Archive Season Label</Label>
                      <Input
                        type="text"
                        value={archiveLabel}
                        onChange={(e) => setArchiveLabel(e.target.value)}
                        placeholder="e.g. 2026 Season"
                        className="bg-zinc-900 border-zinc-800 text-xs h-9"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setShowConfirmArchive(true)}
                      disabled={games.length === 0}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold h-9.5 rounded-xl shadow-md shadow-amber-500/10"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive Active Season ({games.length} Games) & Start Fresh
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Confirm Archive & New Year Reset</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Your {games.length} games will be stored in your Past Years archives with custom poster artwork and a JSON backup will download automatically.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowConfirmArchive(false)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs h-8"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleExecuteArchive}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold h-8"
                      >
                        Yes, Archive & Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual JSON Export & File Restore */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
                <Label className="text-xs font-bold text-zinc-300">File Backup & Manual Restore</Label>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={handleExportActive}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold h-9"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export Active JSON
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Restore JSON File
                  </Button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* FULL GAME LEDGER MODAL */}
      <YearLedgerModal
        archive={selectedLedgerArchive}
        isOpen={Boolean(selectedLedgerArchive)}
        onClose={() => setSelectedLedgerArchive(null)}
        teamName={teamName}
      />
    </div>
  );
};

export default TeamSettingsModal;
