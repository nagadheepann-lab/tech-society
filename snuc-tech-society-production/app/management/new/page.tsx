'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import SessionGate from '../../components/SessionGate'

type OpportunityForm = {
  title: string
  organization: string
  type: string
  description: string
  eligibility: string
  skills: string
  mode: string
  location: string
  stipend_or_prize: string
  application_url: string
  official_website: string
  brochure_url: string
  rules_url: string
  team_size: string
  registration_fee: string
  contact_name: string
  contact_email: string
  contact_phone: string
  deadline: string
  start_date: string
  result_date: string
  is_featured: boolean
}

const initialForm: OpportunityForm = {
  title: '',
  organization: '',
  type: 'hackathon',
  description: '',
  eligibility: '',
  skills: '',
  mode: 'Online',
  location: '',
  stipend_or_prize: '',
  application_url: '',
  official_website: '',
  brochure_url: '',
  rules_url: '',
  team_size: '',
  registration_fee: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  deadline: '',
  start_date: '',
  result_date: '',
  is_featured: false
}

type FieldProps = {
  label: string
  value: string | number
  set: (value: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}

function Field({
  label,
  value,
  set,
  type = 'text',
  required = false,
  placeholder = ''
}: FieldProps) {
  return (
    <div className="field">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  )
}

type TextProps = {
  label: string
  value: string
  set: (value: string) => void
  required?: boolean
  placeholder?: string
}

function Text({
  label,
  value,
  set,
  required = false,
  placeholder = ''
}: TextProps) {
  return (
    <div className="field">
      <label>{label}</label>

      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  )
}

type SelectProps = {
  label: string
  value: string
  set: (value: string) => void
  options: string[]
}

function Select({
  label,
  value,
  set,
  options
}: SelectProps) {
  return (
    <div className="field">
      <label>{label}</label>

      <select
        value={value}
        onChange={(e) => set(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function NewOpportunity() {
  const router = useRouter()

  const [form, setForm] = useState<OpportunityForm>(initialForm)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField<K extends keyof OpportunityForm>(
    key: K,
    value: OpportunityForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage('Please sign in as management.')
        setSaving(false)
        return
      }

      const skills = form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)

      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        type: form.type,
        description: form.description.trim(),
        eligibility: form.eligibility.trim(),
        skills,
        mode: form.mode.trim(),
        location: form.location.trim(),
        stipend_or_prize: form.stipend_or_prize.trim(),
        application_url: form.application_url.trim(),
        official_website: form.official_website.trim(),
        brochure_url: form.brochure_url.trim() || null,
        rules_url: form.rules_url.trim() || null,
        team_size: form.team_size.trim(),
        registration_fee: form.registration_fee
          ? Number(form.registration_fee)
          : null,
        contact_name: form.contact_name.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        deadline: form.deadline
          ? new Date(form.deadline).toISOString()
          : null,
        start_date: form.start_date
          ? new Date(form.start_date).toISOString()
          : null,
        result_date: form.result_date
          ? new Date(form.result_date).toISOString()
          : null,
        is_featured: form.is_featured,
        status: 'published',
        created_by: user.id
      }

      const { error } = await supabase
        .from('opportunities')
        .insert(payload)

      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }

      router.push('/management')
    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while publishing the opportunity.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <SessionGate role="management">
      <div className="form-wide">

        <Link href="/management" className="back">
          <ArrowLeft size={16} />
          Management
        </Link>

        <div className="top">
          <div>
            <div className="eyebrow">
              Publish opportunity
            </div>

            <div className="title">
              Create an opportunity
            </div>

            <div className="sub">
              Give students enough verified detail to decide quickly
              and apply confidently.
            </div>
          </div>
        </div>

        <form
          className="card form-card"
          onSubmit={submit}
        >

          {/* BASIC INFORMATION */}

          <div className="form-section">
            <h2>Basics</h2>

            <div className="form-grid">

              <Field
                label="Title *"
                value={form.title}
                set={(value) =>
                  updateField('title', value)
                }
                required
                placeholder="Example: National AI Hackathon"
              />

              <Field
                label="Organisation *"
                value={form.organization}
                set={(value) =>
                  updateField('organization', value)
                }
                required
                placeholder="Organisation name"
              />

              <Select
                label="Type *"
                value={form.type}
                set={(value) =>
                  updateField('type', value)
                }
                options={[
                  'hackathon',
                  'internship',
                  'fellowship',
                  'competition',
                  'workshop'
                ]}
              />

              <Field
                label="Mode"
                value={form.mode}
                set={(value) =>
                  updateField('mode', value)
                }
                placeholder="Online / Offline / Hybrid"
              />

              <Field
                label="Location"
                value={form.location}
                set={(value) =>
                  updateField('location', value)
                }
                placeholder="Chennai / Remote / Campus"
              />

              <Field
                label="Team size"
                value={form.team_size}
                set={(value) =>
                  updateField('team_size', value)
                }
                placeholder="Example: 2-4 members"
              />

            </div>

            <Text
              label="Description *"
              value={form.description}
              set={(value) =>
                updateField('description', value)
              }
              required
              placeholder="Describe the opportunity, what participants will do, and what they can expect."
            />

            <Text
              label="Eligibility"
              value={form.eligibility}
              set={(value) =>
                updateField('eligibility', value)
              }
              placeholder="Who can apply? Mention year, department, academic requirements, etc."
            />

            <Field
              label="Skills (comma separated)"
              value={form.skills}
              set={(value) =>
                updateField('skills', value)
              }
              placeholder="Python, AI, Machine Learning, Figma"
            />
          </div>


          {/* LINKS */}

          <div className="form-section">
            <h2>Links & application</h2>

            <div className="form-grid">

              <Field
                label="Official website *"
                type="url"
                value={form.official_website}
                set={(value) =>
                  updateField('official_website', value)
                }
                required
                placeholder="https://example.com"
              />

              <Field
                label="Application URL *"
                type="url"
                value={form.application_url}
                set={(value) =>
                  updateField('application_url', value)
                }
                required
                placeholder="https://example.com/apply"
              />

              <Field
                label="Rules / guidelines URL"
                type="url"
                value={form.rules_url}
                set={(value) =>
                  updateField('rules_url', value)
                }
                placeholder="https://example.com/rules"
              />

              <Field
                label="Brochure URL"
                type="url"
                value={form.brochure_url}
                set={(value) =>
                  updateField('brochure_url', value)
                }
                placeholder="https://example.com/brochure.pdf"
              />

            </div>
          </div>


          {/* DATES AND REWARD */}

          <div className="form-section">
            <h2>Dates & reward</h2>

            <div className="form-grid">

              <Field
                label="Application deadline *"
                type="datetime-local"
                value={form.deadline}
                set={(value) =>
                  updateField('deadline', value)
                }
                required
              />

              <Field
                label="Start date"
                type="datetime-local"
                value={form.start_date}
                set={(value) =>
                  updateField('start_date', value)
                }
              />

              <Field
                label="Result date"
                type="datetime-local"
                value={form.result_date}
                set={(value) =>
                  updateField('result_date', value)
                }
              />

              <Field
                label="Registration fee"
                type="number"
                value={form.registration_fee}
                set={(value) =>
                  updateField('registration_fee', value)
                }
                placeholder="0"
              />

              <Field
                label="Stipend / prize"
                value={form.stipend_or_prize}
                set={(value) =>
                  updateField('stipend_or_prize', value)
                }
                placeholder="Example: ₹50,000 prize pool"
              />

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) =>
                    updateField(
                      'is_featured',
                      event.target.checked
                    )
                  }
                />

                <span>
                  Feature this opportunity
                </span>
              </label>

            </div>
          </div>


          {/* CONTACT */}

          <div className="form-section">
            <h2>Contact</h2>

            <div className="form-grid">

              <Field
                label="Contact name"
                value={form.contact_name}
                set={(value) =>
                  updateField('contact_name', value)
                }
                placeholder="Contact person"
              />

              <Field
                label="Contact email"
                type="email"
                value={form.contact_email}
                set={(value) =>
                  updateField('contact_email', value)
                }
                placeholder="contact@example.com"
              />

              <Field
                label="Contact phone"
                value={form.contact_phone}
                set={(value) =>
                  updateField('contact_phone', value)
                }
                placeholder="+91 XXXXX XXXXX"
              />

            </div>
          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <Link
              href="/management"
              className="btn secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn"
              disabled={saving}
            >
              {saving
                ? 'Publishing…'
                : 'Publish opportunity'}
            </button>

          </div>


          {message && (
            <div className="flash error">
              {message}
            </div>
          )}

        </form>
      </div>
    </SessionGate>
  )
}
