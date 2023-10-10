'use client'

import React, { type FC, useState, useEffect, useRef } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { DateInput } from './date-input'
import { Label } from './label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { Switch } from './switch'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from './separator'
import { IconCalendar } from '../icons/svgIcons'
import { useSearchParams } from 'next/navigation'

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom?: Date | string
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
    queryParamString?: string | undefined,
    classFromParent?: string
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

// Define presets
const PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 Days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' },
    { name: 'thisQuarter', label: 'This Quarter' },
    { name: 'thisYear', label: 'This Year' },
    // { name: 'lastYear', label: 'Last Year' },
    { name: 'allTime', label: 'All Time' },
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date((new Date()).setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'end',
    locale = 'en-US',
    showCompare = false,
    queryParamString = undefined,
    classFromParent = ""

}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)

        const searchParams = useSearchParams()
        const queryParamIds = searchParams.get("ids")
        let queryParam: string | undefined = undefined
        if (queryParamIds && queryParamIds?.length > 0) {
            queryParam = queryParamIds
        }
        console.log(initialCompareFrom, initialCompareTo)
        const [range, setRange] = useState<DateRange>({
            from: new Date((new Date(initialDateFrom)).setHours(0, 0, 0, 0)),
            to: initialDateTo ? new Date((new Date(initialDateTo)).setHours(0, 0, 0, 0)) : new Date((new Date(initialDateFrom)).setHours(0, 0, 0, 0))
        })

        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: new Date((new Date(initialCompareFrom)).setHours(0, 0, 0, 0)),
                    to: initialCompareTo
                        ? new Date((new Date(initialCompareTo)).setHours(0, 0, 0, 0))
                        : new Date((new Date(initialCompareFrom)).setHours(0, 0, 0, 0))
                }
                : undefined
        )


        // Refs to store the values of range and rangeCompare when the date picker is opened
        const openedRangeRef = useRef<DateRange | undefined>();
        const openedRangeCompareRef = useRef<DateRange | undefined>();

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== 'undefined' ? window.innerWidth < 960 : false
        )

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960)
            }

            window.addEventListener('resize', handleResize)

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        const getPresetRange = (presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName)
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
            const from = new Date()
            const to = new Date()
            const first = from.getDate() - from.getDay()

            switch (preset.name) {
                case 'today':
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'yesterday':
                    from.setDate(from.getDate() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(to.getDate() - 1)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last7':
                    from.setDate(from.getDate() - 6)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last14':
                    from.setDate(from.getDate() - 13)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last30':
                    from.setDate(from.getDate() - 29)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisWeek':
                    from.setDate(first)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisMonth':
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastMonth':
                    from.setMonth(from.getMonth() - 1)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisQuarter':
                    const currentMonth = from.getMonth(); // In this example, currentMonth will be 8 (September)
                    const quarterStartMonth = currentMonth - (currentMonth % 3); // Quarter start month will be 6 (July)
                    const quarterStartDate = new Date(from.getFullYear(), quarterStartMonth, 1, 0, 0, 0, 0);
                    const lastDayOfQuarter = new Date(from.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59, 999); // The last day of the quarter is the last day of September

                    from.setTime(quarterStartDate.getTime()); // Start date will be July 1, 2023, 00:00:00.000
                    to.setTime(lastDayOfQuarter.getTime());    // End date will be September 30, 2023, 23:59:59.999

                    break;
                case 'thisYear':
                    from.setMonth(0);
                    from.setDate(1);
                    from.setHours(0, 0, 0, 0);
                    to.setHours(23, 59, 59, 999);
                    break;
                case 'lastYear':
                    from.setFullYear(from.getFullYear() - 1);
                    from.setMonth(0);
                    from.setDate(1);
                    to.setFullYear(to.getFullYear() - 1);
                    to.setMonth(11);
                    to.setDate(31);
                    to.setHours(23, 59, 59, 999);
                    break;
                case 'allTime':
                    from.setTime(0);
                    to.setHours(23, 59, 59, 999);
                    break;

            }

            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const range = getPresetRange(preset)
            console.log(preset, range)
            setRange(range)
            if (rangeCompare) {
                const rangeCompare = {
                    from: new Date(
                        range.from.getFullYear() - 1,
                        range.from.getMonth(),
                        range.from.getDate()
                    ),
                    to: range.to
                        ? new Date(
                            range.to.getFullYear() - 1,
                            range.to.getMonth(),
                            range.to.getDate()
                        )
                        : undefined
                }
                setRangeCompare(rangeCompare)
            }
        }

        const checkPreset = (): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)

                const normalizedRangeFrom = new Date(range.from.setHours(0, 0, 0, 0))
                const normalizedPresetFrom = new Date(
                    presetRange.from.setHours(0, 0, 0, 0)
                )

                const normalizedRangeTo = new Date(range.to?.setHours(0, 0, 0, 0) ?? 0)
                const normalizedPresetTo = new Date(
                    presetRange.to?.setHours(0, 0, 0, 0) ?? 0
                )

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name)
                    console.log(preset.name)
                    return
                }
            }

            setSelectedPreset(undefined)
        }

        const resetValues = (): void => {
            const { from, to } = getLast7Days(queryParamString)

            setRange({
                from: from,
                to: to
            })
            setRangeCompare(
                initialCompareFrom
                    ? {
                        from: from,
                        to: to
                    }
                    : undefined
            )
        }

        useEffect(() => {
            checkPreset()
        }, [range])

        const PresetButton = ({
            preset,
            label,
            isSelected
        }: {
            preset: string
            label: string
            isSelected: boolean
        }): JSX.Element => (
            <Button
                className={cn(isSelected && 'pointer-events-none bg-accent text-accent-foreground')}
                variant="ghost"
                onClick={() => { setPreset(preset) }}
            >
                <>
                    {/* <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
                        <CheckIcon width={18} height={18} />
                    </span> */}
                    {label}
                </>
            </Button>
        )

        // Helper function to check if two date ranges are equal
        const areRangesEqual = (a?: DateRange, b?: DateRange) => {
            if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
            return (
                a.from.getTime() === b.from.getTime() &&
                (!a.to || !b.to || a.to.getTime() === b.to.getTime())
            );
        };

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range;
                openedRangeCompareRef.current = rangeCompare;
            }
        }, [isOpen]);

        return (
            <Popover modal={true} open={isOpen} onOpenChange={(open: boolean) => {
                if (!open) {
                    resetValues()
                }
                setIsOpen(open)
            }}>
                <PopoverTrigger asChild>
                    <Button variant="google">
                        <div className="flex flex-row gap-2 mr-2 ">
                            {/* <div className="py-1">
                                <div>{`${formatDate(range.from, locale)}${(range.to != null) ? ' - ' + formatDate(range.to, locale) : ''
                                    }`}</div>
                            </div>
                            {
                                (rangeCompare != null) && (
                                    <div className="opacity-60 text-xs -mt-1">
                                        <>
                                            vs. {formatDate(rangeCompare.from, locale)}
                                            {(rangeCompare.to != null) ? ` - ${formatDate(rangeCompare.to, locale)}` : ''}
                                        </>
                                    </div>
                                )
                            } */}
                            <IconCalendar size="20" />
                            {PRESETS.find((preset) => { return preset.name === selectedPreset })?.label || "Custom Range"}
                        </div>
                        <div className="pl-1 opacity-60 -mr-2 scale-125 px-2">
                            {
                                isOpen ? (<ChevronUpIcon width={16} />) : (<ChevronDownIcon width={16} />)
                            }
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align} className={`w-auto sm:max-h-[200px] xl:max-h-[350px] 2xl:max-h-fit overflow-y-auto ${classFromParent}`}>
                    <div >

                        <div className="flex py-2">
                            {
                                !isSmallScreen && (<div className="flex flex-col gap-1 pl-2 pr-6 pb-0">
                                    <div className="flex w-full flex-col items-start gap-1 pr-6 pb-2">
                                        {PRESETS.map((preset) => (
                                            <PresetButton
                                                key={preset.name}
                                                preset={preset.name}
                                                label={preset.label}
                                                isSelected={selectedPreset === preset.name}
                                            />
                                        ))}
                                    </div>
                                </div>)
                            }
                            {!isSmallScreen && <div className="h-[full] w-[1px] bg-gray-200 mr-2"></div>}
                            <div className="flex">
                                <div className="flex flex-col">
                                    <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                        <div className="flex items-center space-x-2 pr-4 py-1">
                                            {
                                                showCompare && (
                                                    <>
                                                        <Switch
                                                            defaultChecked={Boolean(rangeCompare)}
                                                            onCheckedChange={(checked: boolean) => {
                                                                if (checked) {
                                                                    if (!range.to) {
                                                                        setRange({
                                                                            from: range.from,
                                                                            to: range.from
                                                                        })
                                                                    }
                                                                    setRangeCompare({
                                                                        from: new Date(
                                                                            range.from.getFullYear(),
                                                                            range.from.getMonth(),
                                                                            range.from.getDate() - 365
                                                                        ),
                                                                        to: range.to
                                                                            ? new Date(
                                                                                range.to.getFullYear() - 1,
                                                                                range.to.getMonth(),
                                                                                range.to.getDate()
                                                                            )
                                                                            : new Date(
                                                                                range.from.getFullYear() - 1,
                                                                                range.from.getMonth(),
                                                                                range.from.getDate()
                                                                            )
                                                                    })
                                                                } else {
                                                                    setRangeCompare(undefined)
                                                                }
                                                            }}
                                                            id="compare-mode"
                                                        />
                                                        <Label htmlFor="compare-mode">Compare</Label>
                                                    </>
                                                )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <DateInput
                                                    value={range.from}
                                                    onChange={(date) => {
                                                        const toDate =
                                                            (range.to == null) || date > range.to ? date : range.to
                                                        setRange((prevRange) => ({
                                                            ...prevRange,
                                                            from: date,
                                                            to: toDate
                                                        }))
                                                    }}
                                                />
                                                <div className="py-1">-</div>
                                                <DateInput
                                                    value={range.to}
                                                    onChange={(date) => {
                                                        const fromDate = date < range.from ? date : range.from
                                                        setRange((prevRange) => ({
                                                            ...prevRange,
                                                            from: fromDate,
                                                            to: date
                                                        }))
                                                    }}
                                                />
                                            </div>
                                            {(rangeCompare != null) && (
                                                <div className="flex gap-2">
                                                    <DateInput
                                                        value={rangeCompare?.from}
                                                        onChange={(date) => {
                                                            if (rangeCompare) {
                                                                const compareToDate =
                                                                    (rangeCompare.to == null) || date > rangeCompare.to
                                                                        ? date
                                                                        : rangeCompare.to
                                                                setRangeCompare((prevRangeCompare) => ({
                                                                    ...prevRangeCompare,
                                                                    from: date,
                                                                    to: compareToDate
                                                                }))
                                                            } else {
                                                                setRangeCompare({
                                                                    from: date,
                                                                    to: new Date()
                                                                })
                                                            }
                                                        }}
                                                    />
                                                    <div className="py-1">-</div>
                                                    <DateInput
                                                        value={rangeCompare?.to}
                                                        onChange={(date) => {
                                                            if (rangeCompare && rangeCompare.from) {
                                                                const compareFromDate =
                                                                    date < rangeCompare.from
                                                                        ? date
                                                                        : rangeCompare.from
                                                                setRangeCompare({
                                                                    ...rangeCompare,
                                                                    from: compareFromDate,
                                                                    to: date
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {isSmallScreen && (
                                        <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                                            <SelectTrigger className="w-[180px] mx-auto mb-2">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRESETS.map((preset) => (
                                                    <SelectItem key={preset.name} value={preset.name}>{preset.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )
                                    }
                                    <div>
                                        <Calendar
                                            mode="range"
                                            onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                                if ((value?.from) != null) {
                                                    setRange({ from: value.from, to: value?.to })
                                                }
                                            }}
                                            selected={range}
                                            numberOfMonths={isSmallScreen ? 1 : 2}
                                            defaultMonth={
                                                new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="h-[1px] w-full bg-gray-200 mb-2"></div>
                        <div className="flex justify-end gap-2 py-2 pr-4">
                            <Button
                                onClick={() => {
                                    setIsOpen(false)
                                    resetValues()
                                }}
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsOpen(false)
                                    if (
                                        !areRangesEqual(range, openedRangeRef.current) ||
                                        !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                                    ) {
                                        onUpdate?.({ range, rangeCompare });
                                    }
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>

                </PopoverContent>
            </Popover>
        )
    }

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'

export function getThisMonth(queryParamString: string | undefined = undefined) {

    if (queryParamString) {
        let from = new Date()
        let to = new Date()
        from.setTime(0);
        to.setHours(23, 59, 59, 999);
        console.log("if", queryParamString, from, to)
        return { from, to }
    } else {
        let today = new Date()
        let lastWeek = new Date(today)
        lastWeek.setDate(today.getDate() - 7)

        let from = new Date()
        let to = new Date()
        // let first = from.getDate() - from.getDay()
        // from.setDate(first)
        // from.setHours(0, 0, 0, 0)
        // to.setHours(23, 59, 59, 999)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        console.log("else", queryParamString, from, to)
        return { from, to }

    }
}
export function getAllTime() {
    let from = new Date()
    let to = new Date()
    from.setTime(0);
    to.setHours(23, 59, 59, 999);
    return { fromAllTime: from, toAllTime: to }

}
export function getLast7Days(queryParamString: string | undefined = undefined) {
    let from = new Date()
    let to = new Date()
    from.setDate(from.getDate() - 6)
    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)
    return { from: from, to: to }

}
