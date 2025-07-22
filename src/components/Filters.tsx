import { Label } from '@radix-ui/react-label';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RESOURCES } from '@/lib/types';
import { Input } from './ui/input';
import { Button } from './ui/button';


interface FiltersProps {
    selectedResource: string
    selectedDate: string
    setSelectedResource: (resource: string) => void
    setSelectedDate: (date: string) => void
    handleClearFilters: () => void
}

const Filters = ({ selectedResource,
    selectedDate,
    setSelectedResource,
    setSelectedDate,
    handleClearFilters }: FiltersProps) => {
    return (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="resource-filter">Filter by Resource</Label>
                <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger>
                        <SelectValue placeholder="All resources" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All resources</SelectItem>
                        {RESOURCES.map((resource) => (
                            <SelectItem key={resource} value={resource}>
                                {resource}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="date-filter">Filter by Date</Label>
                <Input id="date-filter" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            <div className="flex items-end">
                <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

export default Filters;