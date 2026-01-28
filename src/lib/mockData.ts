export interface AgentMetric {
    dateIso: string; // YYYY-MM-DD
    label: string;   // For display context if needed
    leads: number;
    formAds: number;
    attended: number;
    transferred: number;
    followUps: number;
    noContinuity: number; // <= 2
    withContinuity: number; // > 2
    continuityRate: string;
}

// Helper to generate dynamic dates relative to "Today" so filters always work
const getRelativeDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysOffset);
    return date.toISOString().split('T')[0];
};

export const METRICS_DATA: AgentMetric[] = [
    {
        dateIso: getRelativeDate(0), // Today
        label: "Hoje",
        leads: 5,
        formAds: 4,
        attended: 5,
        transferred: 0,
        followUps: 8,
        noContinuity: 5,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
    {
        dateIso: getRelativeDate(1), // Yesterday
        label: "Ontem",
        leads: 9,
        formAds: 5,
        attended: 9,
        transferred: 2,
        followUps: 4,
        noContinuity: 7,
        withContinuity: 2,
        continuityRate: "22,2%",
    },
    {
        dateIso: getRelativeDate(2),
        label: "21/01",
        leads: 9,
        formAds: 7,
        attended: 11,
        transferred: 1,
        followUps: 10,
        noContinuity: 9,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
    {
        dateIso: getRelativeDate(3),
        label: "20/01",
        leads: 6,
        formAds: 5,
        attended: 7,
        transferred: 0,
        followUps: 4,
        noContinuity: 6,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
    {
        dateIso: getRelativeDate(4),
        label: "19/01",
        leads: 7,
        formAds: 6,
        attended: 7,
        transferred: 0,
        followUps: 11,
        noContinuity: 7,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
    {
        dateIso: getRelativeDate(5),
        label: "18/01",
        leads: 12,
        formAds: 9,
        attended: 13,
        transferred: 0,
        followUps: 11,
        noContinuity: 12,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
    {
        dateIso: getRelativeDate(6),
        label: "17/01",
        leads: 11,
        formAds: 10,
        attended: 13,
        transferred: 0,
        followUps: 10,
        noContinuity: 11,
        withContinuity: 0,
        continuityRate: "0,0%",
    },
];
