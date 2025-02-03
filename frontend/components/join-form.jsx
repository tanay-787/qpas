import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Controller } from "react-hook-form"

const fetchFormFields = async (institutionId, selectedRole) => {
  if (!institutionId || !selectedRole) return []

  const response = await axios.get(`/api/institutions/${institutionId}/${selectedRole}/form`)
  return response.data
}

export function JoinForm({ control, institution, selectedRole, onSubmit, onFormStructureChange }) {
  // Fetch form fields using React Query
  const {
    data: formFields,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["formFields", institution?.inst_id, selectedRole], // Unique key for caching
    queryFn: () => fetchFormFields(institution?.inst_id, selectedRole), // Use the external function
    enabled: !!institution?.inst_id && !!selectedRole, // Only fetch if institution and role are available
    retry: false, // Disable automatic retries
    onSuccess: (data) => {
      // Pass the form structure back to the parent
      onFormStructureChange(data)
    },
  })

  // Loading state
  if (isLoading) {
    return <div>Loading form fields...</div>
  }

  // Error state with "Try Again" button
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="text-red-500">Error: {error.message}</div>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    )
  }

  // Render the form fields
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {formFields?.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.name}</Label>
          {field.type === "file" ? (
            <>
              <Controller
                name={field.name}
                control={control}
                rules={{ required: field.required }}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    {...rest}
                    type="file"
                    accept={field.fileTypes ? field.fileTypes.join(",") : "*"}
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                )}
              />
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </>
          ) : (
            <>
              <Controller
                name={field.name}
                control={control}
                rules={{ required: field.required }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={field.type}
                    className="w-full"
                  />
                )}
              />
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </>
          )}
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  )
}