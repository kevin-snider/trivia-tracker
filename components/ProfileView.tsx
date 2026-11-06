import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Trophy, 
  Sparkles, 
  Pencil, 
  Check, 
  X, 
  Camera, 
  Database,
  Download,
  Upload,
  Trash2,
  Users,
  ShieldAlert
} from 'lucide-react';
import { TriviaGame } from '../types';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ProfileViewProps {
  games: TriviaGame[];
  totalGames: number;
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteGame: (id: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  teamName: string;
  setTeamName: (name: string) => void;
  teamLogo: string;
  setTeamLogo: (logo: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  games,
  totalGames,
  exportData,
  importData,
  deleteGame,
  fileInputRef,
  teamName,
  setTeamName,
  teamLogo,
  setTeamLogo
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(teamName);
  const [showStates, setShowStates] = useState(true);

  const handleSaveName = () => {
    if (!tempName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }
    setTeamName(tempName.trim());
    localStorage.setItem('trivia_team_name', tempName.trim());
    setIsEditingName(false);
    toast.success("Team name updated!");
  };

  const handleCancelName = () => {
    setTempName(teamName);
    setIsEditingName(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file is too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTeamLogo(base64String);
        localStorage.setItem('trivia_team_logo', base64String);
        toast.success("Profile image updated matches local style!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Page Header with Toggle for Saved States in the Top-Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Team Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage team identity, view your roster, and organize local storage states.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Saved States Toggle (Top Right of the section as specified) */}
          <Button 
            variant={showStates ? 'secondary' : 'outline'} 
            onClick={() => setShowStates(!showStates)}
            className="rounded-xl gap-2 font-bold text-xs"
          >
            <Database className="w-4 h-4 text-blue-500" />
            {showStates ? 'Hide Saved States' : 'Database Controls'}
          </Button>
        </div>
      </div>

      {/* Main Profile Layout: Two columns on desktop to support "save states in the top right" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile Details & Core Members (8 cols or full if States is closed) */}
        <div className={`${showStates ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
          
          {/* Main Card with Team Info */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              {/* Profile Image & Changers */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
                  {teamLogo ? (
                    <img 
                      src={teamLogo} 
                      alt="Team Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                      <span className="text-5xl">🍺</span>
                    </div>
                  )}
                  
                  {/* Photo Edit Overlay */}
                  <label htmlFor="team-logo-upload" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-2xl">
                    <Camera className="w-6 h-6 mb-1 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                  </label>
                </div>
                <input 
                  type="file" 
                  id="team-logo-upload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>

              {/* Team ID and Details */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                
                {/* Team Name display or edit */}
                {isEditingName ? (
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-2xl font-black bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={32}
                    />
                    <div className="flex gap-1.5">
                      <Button onClick={handleSaveName} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-9 h-9">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleCancelName} variant="outline" size="icon" className="rounded-xl w-9 h-9 border-slate-200 dark:border-slate-800">
                        <X className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start group">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {teamName}
                    </h3>
                    <Button 
                      onClick={() => setIsEditingName(true)} 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Fixed Team Metadata */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Est. Jan 18, 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>{totalGames} Games Played</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Core Members Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Core Team Members</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Member card Kevin */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
                  K
                </div>
                <div>
                  <h5 className="font-black text-slate-900 dark:text-white">Kevin</h5>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Vibe maker</p>
                </div>
              </div>

              {/* Member card Amanda */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
                  A
                </div>
                <div>
                  <h5 className="font-black text-slate-900 dark:text-white">Amanda</h5>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">CAmanda in Chief</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side / Top-Right area: Saved States Database management Controls (interactive panel, togglable) */}
        {showStates && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6">
              
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Database Backup States</h4>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-xs">All records reside directly inside your current web browser local storage sandbox.</p>
              </div>

              {/* Backup Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={exportData} className="rounded-xl border-slate-200 dark:border-slate-800 gap-2 h-10 text-xs font-bold w-full" variant="outline">
                  <Download className="w-4 h-4 text-emerald-500" /> Export Backup
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} className="rounded-xl border-slate-200 dark:border-slate-800 gap-2 h-10 text-xs font-bold w-full" variant="outline">
                  <Upload className="w-4 h-4 text-blue-500" /> Import Backup
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={importData} />
              </div>

              {/* Local States Raw Table */}
              <div className="space-y-3">
                <h5 className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{games.length} Saved Records Available</h5>
                
                {games.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-6 text-center border border-dashed rounded-2xl">No active entries inside current localStorage profile.</p>
                ) : (
                  <div className="overflow-hidden border border-slate-100 dark:border-slate-800/60 rounded-2xl max-h-[220px] overflow-y-auto">
                    <Table>
                      <TableBody>
                        {games.map(game => (
                          <TableRow key={game.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 border-b border-slate-100 dark:border-slate-850">
                            <TableCell className="font-semibold text-[11px] text-slate-500 dark:text-slate-400 py-2">
                              {new Date(game.date).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric', year: '2-digit'})}
                            </TableCell>
                            <TableCell className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300 py-2">
                              S: {game.score}
                            </TableCell>
                            <TableCell className="font-bold text-[11px] text-slate-600 dark:text-slate-400 py-2">
                              P: {game.place}th
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteGame(game.id)}
                                className="h-6 w-6 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                              >
                                <Trash2 className="w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProfileView;
