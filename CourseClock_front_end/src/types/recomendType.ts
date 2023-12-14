export type EventType = {
    start: string;
    end: string;
    id: number;
    text: string;
};


export type ConfigProps = {
    viewType: string;
    days: number;
    startDate: string;
    showHeader: boolean;
    durationBarVisible: boolean;
    heightSpec: string;
    businessBeginsHour: number;
    headerDateFormat: string;
    eventMoveHandling: string;
    timeFormat: string;
    eventArrangement: string;
    events?: EventType[];
};

export type ColumnType = {
    id: number;
    startTime: string;
    endTime: string;
    hits: number;
};

export type UniqueHitsResp = {
    uniqueHits: number;
};