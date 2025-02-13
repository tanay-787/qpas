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

export function JoinForm({ control, institution, selectedRole, onSubmit }) {
  // Fetch form fields using React Query
  const { data: formFields } = useQuery({
    queryKey: ["formFields", institution?.inst_id, selectedRole],
    queryFn: () => fetchFormFields(institution?.inst_id, selectedRole),
    enabled: !!institution?.inst_id && !!selectedRole,
    retry: false,
  });


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
              
            </>
          )}
        </div>
      ))}
    </form>
  )
}