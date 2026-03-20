import { create } from 'zustand';

type RecordFilter = number | 'all';

type TooltipState = {
  key: string;
  index: number;
  x: number;
  y: number;
  xLabel: string;
  value: number;
} | null;

type HealthMetricStore = {
  recordFilter: RecordFilter;
  filterModalOpen: boolean;
  customFilterValue: string;
  selectedSeriesKey: string;
  tooltip: TooltipState;

  setRecordFilter: (value: RecordFilter) => void;
  setFilterModalOpen: (open: boolean) => void;
  setCustomFilterValue: (value: string) => void;
  setSelectedSeriesKey: (key: string) => void;
  setTooltip: (tooltip: TooltipState) => void;

  openFilterModal: () => void;
  closeFilterModal: () => void;
  syncCustomFilterValue: () => void;
  confirmCustomFilter: () => void;
};

export const useHealthMetricStore = create<HealthMetricStore>((set, get) => ({
  recordFilter: 7,
  filterModalOpen: false,
  customFilterValue: '7',
  selectedSeriesKey: '',
  tooltip: null,

  setRecordFilter: (value) => set({ recordFilter: value }),
  setFilterModalOpen: (open) => set({ filterModalOpen: open }),
  setCustomFilterValue: (value) => set({ customFilterValue: value }),
  setSelectedSeriesKey: (key) => set({ selectedSeriesKey: key }),
  setTooltip: (tooltip) => set({ tooltip }),

  openFilterModal: () => set({ filterModalOpen: true }),
  closeFilterModal: () => set({ filterModalOpen: false }),

  syncCustomFilterValue: () => {
    const { recordFilter } = get();
    set({
      customFilterValue: String(recordFilter === 'all' ? 7 : recordFilter),
    });
  },

  confirmCustomFilter: () => {
    const { customFilterValue } = get();
    const n = Number(customFilterValue);

    if (!Number.isNaN(n) && n > 0) {
      set({
        recordFilter: n as RecordFilter,
        filterModalOpen: false,
      });
      return;
    }

    set({ filterModalOpen: false });
  },
}));