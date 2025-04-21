import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useInstitution } from "../../context/InstitutionContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Book, Building2, FileText, GraduationCap, Lock, LockOpen } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { DockBar } from "@/components/ui/dock-bar";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PenTool } from "lucide-react";


const fetchPapersByInstitution = async (institutionId) => {
  try {
    const response = await axios.get(`/api/question-papers/${institutionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch question papers");
  }
};

export default function StudentDashboard() {
  const { institution } = useInstitution();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subjects: [],
    examTypes: [],
    degrees: [],
    accessTypes: [],
    createdBy: [],
    belongsTo: [],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [filteredPapers, setFilteredPapers] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["student-view-qp", institution?.inst_id],
    queryFn: async () => await fetchPapersByInstitution(institution?.inst_id),
    enabled: !!institution?.inst_id,
  });

  useEffect(() => {
    if (data?.questionPapers) {
      applyFilters();
    }
  }, [data, filters, searchTerm, sortBy]);

  const applyFilters = () => {
    let filtered = [...data.questionPapers];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(paper =>
        paper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filters
    if (filters.subjects.length > 0) {
      filtered = filtered.filter(paper => filters.subjects.includes(paper.subject));
    }
    if (filters.examTypes.length > 0) {
      filtered = filtered.filter(paper => filters.examTypes.includes(paper.examinationType));
    }
    if (filters.degrees.length > 0) {
      filtered = filtered.filter(paper => filters.degrees.includes(paper.degree));
    }
    if (filters.accessTypes.length > 0) {
      filtered = filtered.filter(paper => filters.accessTypes.includes(paper.accessType));
    }
    if (filters.createdBy.length > 0) {
      filtered = filtered.filter(paper => filters.createdBy.includes(paper.createdBy.displayName));
    }
    if (filters.belongsTo.length > 0) {
      filtered = filtered.filter(paper => filters.belongsTo.includes(paper.belongsTo.name));
    }

    // Sorting logic remains same
    const getDate = (createdAt) => {
      if (createdAt?._seconds) {
        return new Date(createdAt._seconds * 1000);
      }
      return new Date(createdAt); // fallback in case it's a string
    };
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => getDate(a.createdAt) - getDate(b.createdAt));
        break;
    }
    

    setFilteredPapers(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Extract unique values for filter options
  const filterOptions = data?.questionPapers ? {
    subjects: {
      title: "Subjects",
      items: [...new Set(data.questionPapers.map(p => p.subject))]
    },
    examTypes: {
      title: "Exam Types",
      items: [...new Set(data.questionPapers.map(p => p.examinationType))]
    },
    degrees: {
      title: "Degrees",
      items: [...new Set(data.questionPapers.map(p => p.degree))]
    },
    accessTypes: {
      title: "Access Type",
      items: [...new Set(data.questionPapers.map(p => p.accessType))]
    },
    createdBy: {
      title: "Created By",
      items: [...new Set(data.questionPapers.map(p => p.createdBy.displayName))]
    },
    belongsTo: {
      title: "Institution",
      items: [...new Set(data.questionPapers.map(p => p.belongsTo.name))]
    },
  } : {};


  return (
    <div className="absolute min-h-screen">
      <div className="p-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-destructive">Error: {error.message}</p>
              ) : filteredPapers.length > 0 ? (
                filteredPapers.map((paper) => (
                  <Card key={paper.qp_id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    <CardHeader className="space-y-1">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-bold line-clamp-2">{paper.name}</CardTitle>
                        <Badge variant={paper.accessType === "Public" ? "default" : "secondary"}>
                          {paper.accessType === "Public" ? (
                            <LockOpen className="w-3 h-3 mr-1" />
                          ) : (
                            <Lock className="w-3 h-3 mr-1" />
                          )}
                          {paper.accessType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-2">
                          <Book className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Subject:</span> {paper.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Degree:</span> {paper.degree}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Exam Type:</span> {paper.examinationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PenTool className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Created By:</span> {paper.createdBy?.displayName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Belongs:</span> {paper.belongsTo?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                      <Separator />
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        variant="default"
                        className="w-full"
                      >
                        <a href={paper.documentURL} target="_blank" rel="noopener noreferrer">
                          View Question Paper
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>No matching question papers found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <DockBar>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search papers..."
            className="pl-10 w-[200px] rounded-full h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Button: Sheet on Mobile, Popover on Desktop */}
        <div className="block">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="pt-6">
                <FilterBar
                  filtersConfig={filterOptions}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <FilterBar
                filtersConfig={filterOptions}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </PopoverContent>
          </Popover>
        </div> */}

        {/* Sort Select */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] rounded-full h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </DockBar>

    </div>
  );
}
export function FilterBar({ filtersConfig, filters, onFilterChange }) {
  return (
    <div className="space-y-4 p-4">
      {Object.entries(filtersConfig).map(([filterKey, { title, items }]) => (
        <div key={filterKey}>
          <h4 className="font-medium mb-2">{title}</h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterKey}-${item}`}
                  checked={filters[filterKey].includes(item)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...filters[filterKey], item]
                      : filters[filterKey].filter((v) => v !== item);

                    onFilterChange({
                      ...filters,
                      [filterKey]: updated,
                    });
                  }}
                />
                <Label htmlFor={`${filterKey}-${item}`}>{item}</Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}