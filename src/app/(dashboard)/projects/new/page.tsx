"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "@/lib/actions/projects";
import {
  permitTypeValues,
  permitTypeLabels,
} from "@/lib/validations";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: (formData.get("state") as string) || "FL",
      zip: formData.get("zip") as string,
      jurisdiction: formData.get("jurisdiction") as string,
      permitType: (formData.get("permitType") as any) || "BUILDING",
      value: formData.get("value") ? Number(formData.get("value")) : undefined,
      description: formData.get("description") as string,
    };

    const result = await createProject(input);

    if (result.success) {
      router.push(result.data?.id ? `/projects/${result.data.id}` : "/projects");
    } else {
      setError(result.error || "Failed to create project");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
          <p className="text-gray-500 text-sm">Create a new permit project</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {/* Project Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Project Name <span className="text-red-500">*</span>
          </label>
          <Input id="name" name="name" required placeholder="e.g., Brickell Luxury Condo Tower" />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
            Property Address <span className="text-red-500">*</span>
          </label>
          <Input id="address" name="address" required placeholder="e.g., 1200 Brickell Avenue, Miami, FL 33131" />
        </div>

        {/* City / State / Zip */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <Input id="city" name="city" placeholder="Miami" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <Input id="state" name="state" defaultValue="FL" />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
            <Input id="zip" name="zip" placeholder="33131" />
          </div>
        </div>

        {/* Jurisdiction */}
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 mb-1.5">
            Jurisdiction <span className="text-red-500">*</span>
          </label>
          <Input id="jurisdiction" name="jurisdiction" required placeholder="e.g., City of Miami" />
        </div>

        {/* Permit Type + Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="permitType" className="block text-sm font-medium text-gray-700 mb-1.5">
              Permit Type
            </label>
            <select
              id="permitType"
              name="permitType"
              defaultValue="BUILDING"
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700"
            >
              {permitTypeValues.map((type) => (
                <option key={type} value={type}>
                  {permitTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Value ($)
            </label>
            <Input id="value" name="value" type="number" min="0" placeholder="0" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief project description..."
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/projects">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
