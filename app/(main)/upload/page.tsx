"use client"
import { createMaterialAction } from "@/lib/actions"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { File, FileUp} from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useActionState, useState} from 'react'

type ActionState = {
  ok: boolean
  errors?: Record<string, string>
  message?: string
}

const initialState: ActionState = { ok: false }

export default function page() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileId, setFileId] = useState("");
  const [uploading, setUploading] =useState(false);
  const [state, formAction] = useActionState(createMaterialAction, initialState);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      alert("Please select only one file.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const res = await fetch("/api/convex/generateUploadUrl");
      const { url } = await res.json();
      const uploadRes = await fetch(url, {
        method: "POST",
        body: files[0], 
      });
      const { storageId } = await uploadRes.json();
      setFileId(storageId);
    } catch (err) {
      alert("File upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='mt-8 mb-15 flex justify-center flex-col items-center'>
      <div className='flex justify-center gap-10 items-center mb-5'>
        <h1 className='font-extrabold'>Upload study materials</h1>
      </div>
      <Card className="w-fit  p-8">
        <CardHeader>
          <CardTitle className="inline-flex gap-3">
            <span className="text-cyan-400"><File /></span>Material Details
          </CardTitle>
        </CardHeader>
        <CardContent>

          <form action={formAction}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label>Material title</Label>
                <Input name="title" placeholder="e.g Intro to Agriculture" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Course Code</Label>
                <Input name="courseCode" placeholder="e.g CSC101" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select name="category">
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="slides">Slides</SelectItem>
                      <SelectItem value="past-question">Past Questions</SelectItem>
                      <SelectItem value="lecture-notes">Lecture Notes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Uploader Name</Label>
                <Input name="uploaderName" placeholder="e.g John Doe" type="text" />
              </div>
              <input name="fileId" type="hidden" value={fileId} />
              <Button type="submit" disabled={!fileId || uploading}>
                {uploading ? "Uploading..." : "Publish Material"}
              </Button>
            </div>
          </form>
          {state.message && <p className="text-green-500 mt-4">{state.message}</p>}
          {state.errors && state.errors && (
            <div className="mt-4">
              {Object.entries(state.errors ?? {}).map(([key, error]) => (
                <p key={key} className="text-red-500">{error}</p>
              ))}
            </div>
          )}
          <div
            className="border-2 border-dashed shadow border-zinc-500 hover:border-cyan-400 hover:shadow-cyan-400 p-5 my-5 rounded-lg cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <FileUp
                className="size-10 text-cyan-500"
                onClick={() => fileInputRef.current?.click()}
              />
              <p className="text-sm">Drag and drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground">One file at a time</p>
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
