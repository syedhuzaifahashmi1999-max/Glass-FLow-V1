
import React, { useState, useMemo } from 'react';
import { Share2, Users, Plus, Search, MoreHorizontal, Settings, Trash2, ArrowUpRight, FolderKanban, Edit, User } from 'lucide-react';
import { Team, Employee, Project } from '../types';
import { MOCK_TEAMS } from '../constants';
import AddTeamModal from '../components/teams/AddTeamModal';

interface TeamsListProps {
  teams?: Team[]; // Passed from App state
  setTeams?: React.Dispatch<React.SetStateAction<Team[]>>;
  employees: Employee[];
  projects?: Project[];
}

const TeamsList: React.FC<TeamsListProps> = ({ teams = MOCK_TEAMS, setTeams, employees, projects = [] }) => {
  // State
  const [localTeams, setLocalTeams] = useState<Team[]>(teams);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // If parent controls state (App.tsx), sync; else use local
  const effectiveTeams = setTeams ? teams : localTeams;
  const updateTeams = setTeams || setLocalTeams;

  // Handlers
  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
      if (editingTeam) {
          updateTeams(prev => prev.map(t => t.id === editingTeam.id ? { ...t, ...teamData } : t));
          setEditingTeam(undefined);
      } else {
          const newTeam: Team = {
              ...teamData,
              id: `t-${Date.now()}`
          };
          updateTeams(prev => [...prev, newTeam]);
      }
  };

  const handleEdit = (team: Team) => {
      setEditingTeam(team);
      setIsModalOpen(true);
  };

  const handleDeleteTeam = (id: string) => {
      if(confirm('Delete this team?')) {
          updateTeams(prev => prev.filter(t => t.id !== id));
          if (selectedTeamId === id) setSelectedTeamId(null);
      }
  };

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingTeam(undefined);
  };

  // Logic & Calculations
  const filteredTeams = effectiveTeams.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  const totalMembers = useMemo(() => {
      const uniqueMembers = new Set<string>();
      effectiveTeams.forEach(t => t.memberIds.forEach(id => uniqueMembers.add(id)));
      return uniqueMembers.size;
  }, [effectiveTeams]);

  const activeProjectsCount = projects.filter(p => p.status === 'Active' && p.teamId).length;

  const selectedTeam = selectedTeamId ? effectiveTeams.find(t => t.id === selectedTeamId) : null;
  const selectedTeamProjects = selectedTeam ? projects.filter(p => p.teamId === selectedTeam.id) : [];

  return (
    <>
    <div className="h-full flex flex-col bg-white dark:bg-[#18181b] overflow-hidden fade-in">
        
        {/* Header with KPIs */}
        <div className="bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-gray-800 px-8 py-6 shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="text-2xl font-light text-black dark:text-white mb-1">Teams</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                        Cross-functional squads and working groups.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Total Teams</span>
                        <div className="text-lg font-light text-black dark:text-white mt-0.5">{effectiveTeams.length}</div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Active Members</span>
                        <div className="text-lg font-light text-black dark:text-white mt-0.5">{totalMembers}</div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Linked Projects</span>
                        <div className="text-lg font-light text-black dark:text-white mt-0.5">{activeProjectsCount}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search teams..." 
                        className="w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm"
                >
                    <Plus size={14} /> Create Team
                </button>
            </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Grid */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-8 transition-all duration-300 ${selectedTeam ? 'w-2/3 pr-4' : 'w-full'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTeams.map(team => {
                        const lead = getEmployee(team.leadId);
                        const teamProjects = projects.filter(p => p.teamId === team.id);
                        
                        return (
                            <div 
                                key={team.id} 
                                onClick={() => setSelectedTeamId(team.id)}
                                className={`
                                    group bg-white dark:bg-[#18181b] rounded-xl border p-6 cursor-pointer transition-all duration-300 flex flex-col
                                    ${selectedTeamId === team.id ? 'border-black dark:border-white shadow-md ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-300 dark:hover:border-gray-700'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                            <Share2 size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-black dark:text-white">{team.name}</h3>
                                            <p className="text-[10px] text-gray-400">{team.memberIds.length} Members</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEdit(team); }}
                                            className="p-1.5 text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                                            className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 min-h-[2.5em]">
                                    {team.description}
                                </p>

                                <div className="mt-auto space-y-4">
                                    
                                    {/* Lead */}
                                    <div className="flex items-center justify-between p-2 bg-gray-50/50 dark:bg-white/5 rounded-lg border border-gray-50 dark:border-gray-800">
                                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wide">Team Lead</span>
                                        {lead ? (
                                            <div className="flex items-center gap-2">
                                                <img src={lead.avatarUrl} className="w-5 h-5 rounded-full border border-white dark:border-[#18181b]" />
                                                <span className="text-xs font-medium text-black dark:text-white">{lead.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                                        )}
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex -space-x-1.5">
                                            {team.memberIds.slice(0, 3).map(mid => {
                                                const m = getEmployee(mid);
                                                if(!m) return null;
                                                return <img key={mid} src={m.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#18181b]" />;
                                            })}
                                            {team.memberIds.length > 3 && (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#18181b] flex items-center justify-center text-[8px] text-gray-500">+{team.memberIds.length - 3}</div>
                                            )}
                                        </div>
                                        {teamProjects.length > 0 && (
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <FolderKanban size={10} /> {teamProjects.length} Projects
                                            </span>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {team.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 text-[9px] text-gray-500 border border-gray-100 dark:border-gray-700">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Drawer */}
            {selectedTeam && (
                <div className="w-[400px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] flex flex-col h-full shadow-xl animate-in slide-in-from-right-10 duration-300 relative z-10">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-light text-black dark:text-white mb-1">{selectedTeam.name}</h2>
                            <div className="flex flex-wrap gap-1">
                                {selectedTeam.tags.map(t => (
                                    <span key={t} className="text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">#{t}</span>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setSelectedTeamId(null)} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                            <ArrowUpRight size={18} className="rotate-45" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        
                        {/* Overview */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Overview</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {selectedTeam.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Lead */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-4">Team Lead</h3>
                            {getEmployee(selectedTeam.leadId) ? (
                                <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-white/5">
                                    <img src={getEmployee(selectedTeam.leadId)?.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="text-sm font-medium text-black dark:text-white">{getEmployee(selectedTeam.leadId)?.name}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{getEmployee(selectedTeam.leadId)?.role}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 italic">No lead assigned</div>
                            )}
                        </div>

                        {/* Members List */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide">Members ({selectedTeam.memberIds.length})</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedTeam.memberIds.map(mid => {
                                    const m = getEmployee(mid);
                                    if(!m) return null;
                                    return (
                                        <div key={mid} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                            <img src={m.avatarUrl} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                                            <div>
                                                <div className="text-xs font-medium text-black dark:text-white">{m.name}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{m.role}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Projects */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-4">Active Projects</h3>
                            <div className="space-y-2">
                                {selectedTeamProjects.length > 0 ? selectedTeamProjects.map(p => (
                                    <div key={p.id} className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-medium text-black dark:text-white">{p.name}</span>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">{p.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                                            <span>{p.client}</span>
                                            <span>{p.progress}%</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-xs text-gray-400 italic">No projects linked.</div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                        <button 
                            onClick={() => handleEdit(selectedTeam)}
                            className="w-full py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:text-black dark:hover:text-white transition-all shadow-sm"
                        >
                            Edit Team Configuration
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>

    <AddTeamModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleAddTeam}
        initialData={editingTeam}
        employees={employees}
    />
    </>
  );
};

export default TeamsList;
