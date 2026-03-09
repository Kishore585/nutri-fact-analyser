
import React from 'react';
import { FoodScanResult, SafetyStatus, FoodItem, ConsumptionGuidance } from '../types';
import { RefreshCw, Share2, Flame, BookOpen, Youtube, ChevronDown } from 'lucide-react';

interface FoodScanViewProps {
    result: FoodScanResult;
    onReset: () => void;
    userProfileName: string;
}

const FoodScanView: React.FC<FoodScanViewProps> = ({ result, onReset, userProfileName }) => {

    const getVerdictConfig = (status: SafetyStatus) => {
        switch (status) {
            case SafetyStatus.SAFE:
                return { letter: 'A', color: '#6B8F71', trackColor: '#E8F0E9' };
            case SafetyStatus.CAUTION:
                return { letter: 'B', color: '#D4A843', trackColor: '#FFF4E0' };
            case SafetyStatus.UNSAFE:
                return { letter: 'C', color: '#C75050', trackColor: '#FFE8E8' };
            default:
                return { letter: '?', color: '#8B8B8B', trackColor: '#F0F0F0' };
        }
    };

    const verdict = getVerdictConfig(result.verdict);
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const progress = result.verdict === SafetyStatus.SAFE ? 0.92 :
        result.verdict === SafetyStatus.CAUTION ? 0.65 :
            result.verdict === SafetyStatus.UNSAFE ? 0.35 : 0.5;
    const strokeDashoffset = circumference * (1 - progress);

    const getStatusDot = (s: SafetyStatus) => {
        switch (s) {
            case SafetyStatus.SAFE: return '#6B8F71';
            case SafetyStatus.CAUTION: return '#D4A843';
            case SafetyStatus.UNSAFE: return '#C75050';
            default: return '#8B8B8B';
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pb-16 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* ═══ Left: Verdict + Calorie Total ═══ */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Gauge Card */}
                    <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl text-center flex flex-col items-center border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 transition-colors">
                        <div className="relative w-44 h-44 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r={radius} fill="none" stroke={verdict.trackColor} strokeWidth="10" className="dark:opacity-30" />
                                <circle cx="80" cy="80" r={radius} fill="none" stroke={verdict.color} strokeWidth="10" strokeLinecap="round"
                                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 700, color: verdict.color }}>
                                    {verdict.letter}
                                </span>
                            </div>
                        </div>

                        <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-[0.25em] mb-1">Food Analysis</p>
                        <h2 className="text-lg text-on-surface dark:text-dark-text mb-6" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>
                            {userProfileName} Profile
                        </h2>

                        <div className="flex gap-3 w-full max-w-[200px]">
                            <button onClick={onReset} className="flex-1 py-3 border border-outline-variant dark:border-dark-border rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.97]">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button className="flex-1 py-3 border border-outline-variant dark:border-dark-border rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all text-on-surface-variant dark:text-dark-text-secondary flex justify-center active:scale-[0.97]">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Total Calories */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 text-center transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-[0.25em]">Total Calories</p>
                        </div>
                        <p className="text-4xl font-bold text-on-surface dark:text-dark-text" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                            {result.totalCalories}
                        </p>
                        <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary mt-1">kcal (estimated)</p>
                    </div>

                    {/* Key Indicators */}
                    <div className="px-2">
                        <h4 className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-[0.25em] mb-5">Key Indicators</h4>
                        <div className="space-y-4">
                            {result.nutritionalHighlights.map((h, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getStatusDot(idx < 2 ? SafetyStatus.SAFE : idx < 4 ? SafetyStatus.CAUTION : SafetyStatus.UNSAFE) }} />
                                    <span className="text-sm text-on-surface dark:text-dark-text leading-snug">{h}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ Right: Summary + Food Items + Guidance ═══ */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Summary */}
                    <div>
                        <h3 className="text-3xl text-on-surface dark:text-dark-text mb-6" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>
                            Meal Analysis
                        </h3>
                        <div className="border-l-2 border-on-surface-variant/30 dark:border-dark-border pl-6 py-2">
                            <p className="text-on-surface-variant dark:text-dark-text-secondary text-lg leading-relaxed" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic' }}>
                                "{result.summary}"
                            </p>
                        </div>
                    </div>

                    {/* Food Items Breakdown */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-on-surface dark:text-dark-text" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>
                                Food Breakdown
                            </h3>
                            <span className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider">
                                {result.foodItems.length} items
                            </span>
                        </div>

                        <div className="space-y-3">
                            {result.foodItems.map((item, idx) => (
                                <FoodItemCard key={idx} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Consumption Guidance */}
                    {result.consumptionGuidance && (
                        <ConsumptionGuidanceSection guidance={result.consumptionGuidance} />
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════ Food Item Card ═══════ */

const FoodItemCard: React.FC<{ item: FoodItem }> = ({ item }) => {
    const [expanded, setExpanded] = React.useState(false);

    const getStatusColor = (s: SafetyStatus) => {
        switch (s) {
            case SafetyStatus.SAFE: return { dot: '#6B8F71', text: 'text-[#6B8F71] dark:text-emerald-400', bg: 'bg-[#6B8F71]/8 dark:bg-emerald-900/20' };
            case SafetyStatus.CAUTION: return { dot: '#D4A843', text: 'text-[#D4A843] dark:text-amber-400', bg: 'bg-[#D4A843]/8 dark:bg-amber-900/20' };
            case SafetyStatus.UNSAFE: return { dot: '#C75050', text: 'text-[#C75050] dark:text-rose-400', bg: 'bg-[#C75050]/8 dark:bg-rose-900/20' };
            default: return { dot: '#8B8B8B', text: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800/20' };
        }
    };

    const sc = getStatusColor(item.status);

    // Parse numeric value from macro strings like "25g"
    const parseGrams = (s: string) => parseFloat(s) || 0;
    const totalMacro = parseGrams(item.protein) + parseGrams(item.carbs) + parseGrams(item.fat);

    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 overflow-hidden transition-colors">
            <div onClick={() => setExpanded(!expanded)} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-container/30 dark:hover:bg-dark-surface-dim/30 transition-colors">
                <div className="flex items-center gap-3 flex-grow">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sc.dot }} />
                    <div className="flex-grow">
                        <span className="text-sm font-semibold text-on-surface dark:text-dark-text">{item.name}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-base font-bold text-on-surface dark:text-dark-text">{item.estimatedCalories}</span>
                        <span className="text-xs text-on-surface-variant dark:text-dark-text-secondary ml-1">kcal</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant/40 dark:text-dark-text-secondary/40 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {expanded && (
                <div className="px-5 pb-4 border-t border-outline-variant/30 dark:border-dark-border/30 pt-4 animate-fade-in">
                    {/* Macro Bars */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                            <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider mb-1">Protein</p>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.protein}</p>
                            <div className="mt-1.5 h-1.5 bg-surface-container dark:bg-dark-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${totalMacro ? (parseGrams(item.protein) / totalMacro) * 100 : 0}%` }} />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider mb-1">Carbs</p>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{item.carbs}</p>
                            <div className="mt-1.5 h-1.5 bg-surface-container dark:bg-dark-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${totalMacro ? (parseGrams(item.carbs) / totalMacro) * 100 : 0}%` }} />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-wider mb-1">Fat</p>
                            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{item.fat}</p>
                            <div className="mt-1.5 h-1.5 bg-surface-container dark:bg-dark-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${totalMacro ? (parseGrams(item.fat) / totalMacro) * 100 : 0}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Status Reason */}
                    <div className="flex items-start gap-2 mt-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-tight ${sc.text} ${sc.bg}`}>
                            {item.status}
                        </span>
                        <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary leading-relaxed">{item.reason}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ═══════ Consumption Guidance (reused pattern) ═══════ */

const ConsumptionGuidanceSection: React.FC<{ guidance: ConsumptionGuidance }> = ({ guidance }) => {
    const getBadge = () => {
        switch (guidance.type) {
            case 'recipe': return { label: '🍳 Recipes', bg: 'bg-[#6B8F71]/10 dark:bg-emerald-900/20', text: 'text-[#6B8F71] dark:text-emerald-400' };
            case 'moderation': return { label: '⚠️ Moderation', bg: 'bg-amber-100/60 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' };
            case 'portion': return { label: '📊 Daily Intake', bg: 'bg-blue-100/60 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' };
        }
    };

    const badge = getBadge();

    return (
        <div>
            <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-surface-container dark:bg-dark-surface-container rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
                </div>
                <div>
                    <h3 className="text-xl text-on-surface dark:text-dark-text mb-1" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>
                        {guidance.title}
                    </h3>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm leading-relaxed mb-6 ml-12">{guidance.advice}</p>

            {guidance.type === 'recipe' && guidance.recipes && guidance.recipes.length > 0 && (
                <div className="space-y-4 ml-12">
                    {guidance.recipes.map((recipe, idx) => (
                        <div key={idx} className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-outline-variant/40 dark:border-dark-border shadow-sm dark:shadow-dark-elevation-1 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow">
                                    <h4 className="text-base text-on-surface dark:text-dark-text mb-2" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>
                                        {recipe.name}
                                    </h4>
                                    <p className="text-sm text-on-surface-variant dark:text-dark-text-secondary leading-relaxed">{recipe.description}</p>
                                </div>
                                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearchQuery)}`} target="_blank" rel="noopener noreferrer"
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-outline-variant dark:border-dark-border rounded-lg text-on-surface dark:text-dark-text text-[11px] font-semibold uppercase tracking-wider hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all">
                                    <Youtube className="w-3.5 h-3.5" /> Watch
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {guidance.type === 'portion' && guidance.dailyAmount && (
                <div className="ml-12 bg-blue-50/60 dark:bg-blue-900/15 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-6 text-center">
                    <p className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Recommended Portion</p>
                    <p className="text-2xl text-blue-700 dark:text-blue-300" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 600 }}>{guidance.dailyAmount}</p>
                </div>
            )}

            {guidance.type === 'moderation' && (
                <div className="ml-12 bg-amber-50/60 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-5 flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">⚡</span>
                    <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                        This is processed/fast food. Consume in minimal quantities and consider healthier alternatives.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FoodScanView;
