// src/lib/application-validation.ts
// Field-value validation rules for the admission application form.
// Fields are identified by their stable `id` independent of their configured
// `fieldType`, so the same domain rules apply regardless of how an admin
// configured the field type in the CMS.

export type FieldDef = {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeValue(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.length === 0 ? "" : value.join(",");
  return String(value).trim();
}

const DIGITS_ONLY = /^\d+$/;
const FLOAT_RE = /^\d+(\.\d+)?$/;

function isFloat(str: string): boolean {
  return FLOAT_RE.test(str);
}

function isInteger(str: string): boolean {
  return DIGITS_ONLY.test(str);
}

/**
 * Logically maps a field id to a semantic validator it should follow,
 * regardless of the configured fieldType.
 */
function fieldSemantics(field: FieldDef): FieldDef | null {
  const id = field.id;

  // Match on the trailing id component so distinct fields never collide
  // (e.g. "percentage_obtained" should not be treated as "marks_obtained").
  const endsWith = (re: RegExp) => re.test(id);

  if (endsWith(/(percentage|percent)(_|$)/i)) {
    return { ...field, id, fieldType: "percentage" } as FieldDef;
  }
  if (endsWith(/full_mar|fullmar|total_mar/i)) {
    return { ...field, id, fieldType: "number" } as FieldDef;
  }
  if (endsWith(/(mark|marks|grade)?_obtained(_|$)/i)) {
    return { ...field, id, fieldType: "obtained" } as FieldDef;
  }
  if (endsWith(/(^|_)(year|gpa|grade_point)(_|$)/i)) {
    const isGpa = /(gpa|grade_point)/i.test(id);
    return { ...field, id, fieldType: isGpa ? "gpa" : "integer" } as FieldDef;
  }
  return null;
}

/**
 * Validate a single field value. Returns an error message string, or null
 * when valid.
 */
export function validateFieldValue(field: FieldDef, value: unknown): string | null {
  const str = normalizeValue(value);

  if (field.required && !str) {
    return `${field.label} is required`;
  }
  if (!str) return null;

  if (field.fieldType === "email") {
    if (!EMAIL_RE.test(str)) {
      return "Please enter a valid email address";
    }
  }

  if (field.fieldType === "phone") {
    if (!DIGITS_ONLY.test(str)) {
      return `${field.label} must contain only digits`;
    }
    if (str.length !== 10) {
      return `${field.label} must be exactly 10 digits`;
    }
  }

  if (field.fieldType === "date") {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const monthDiff = today.getMonth() - d.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
        age--;
      }
      if (age < 16) {
        return "You must be at least 16 years old";
      }
    }
  }

  const semantic = fieldSemantics(field);
  if (semantic) {
    const semErr = validateSemantic(semantic, str, value);
    if (semErr) return semErr;
  } else {
    const typeErr = validateByType(field, str);
    if (typeErr) return typeErr;
  }

  return null;
}

function validateByType(field: FieldDef, str: string): string | null {
  if (field.fieldType === "number") {
    if (!DIGITS_ONLY.test(str)) {
      return `${field.label} must be a valid number`;
    }
  }
  return null;
}

function validateSemantic(field: FieldDef, str: string, value: unknown): string | null {
  switch (field.fieldType) {
    case "gpa":
      if (!isFloat(str)) {
        return `${field.label} must be a valid number (e.g. 3.45)`;
      }
      if (parseFloat(str) > 4) {
        return `${field.label} cannot be greater than 4`;
      }
      break;

    case "integer":
      if (!isInteger(str)) {
        return `${field.label} must be a whole number (no decimals)`;
      }
      break;

    case "number":
      if (!isInteger(str)) {
        return `${field.label} must be a whole number`;
      }
      break;

    case "obtained":
      if (!isInteger(str)) {
        return `${field.label} must be a whole number`;
      }
      break;

    case "percentage":
      if (!isInteger(str)) {
        return `${field.label} must be a whole number`;
      }
      if (parseInt(str, 10) > 100) {
        return `${field.label} cannot be greater than 100`;
      }
      break;
  }
  return null;
}

/**
 * Resolve the "obtained" field that pairs with a given full-marks field id.
 * e.g. "see_full_mark" -> "see_mark_obtained".
 */
function obtainedIdForFullMarks(fullMarksId: string): string | null {
  const m = fullMarksId.match(/^(.*)(full_mar|fullmar|total_mar)[a-z_]*$/i);
  if (!m) return null;
  return `${m[1]}mark_obtained`;
}

/**
 * Validate the current "obtained marks" fields against their paired full-marks
 * fields. Returns a list of error messages (empty when valid). `form` is the
 * entire form state keyed by field id.
 */
export function validateObtainedVsFullMarks(
  fields: FieldDef[],
  form: Record<string, unknown>
): string[] {
  const errors: string[] = [];

  // Group obtained fields by their "base" (see / intermediate) so we can pair
  // them with the matching full-marks field.
  const baseOf = (id: string) => id.split("_")[0] || id;

  const obtainedFields = fields.filter(
    (f) => (fieldSemantics(f)?.fieldType ?? "") === "obtained"
  );

  for (const obtained of obtainedFields) {
    const base = baseOf(obtained.id);
    const fullMarksField = fields.find(
      (f) =>
        baseOf(f.id) === base &&
        (fieldSemantics(f)?.fieldType ?? "") === "number"
    );

    if (!fullMarksField) continue;

    const obtainedVal = parseInt(normalizeValue(form[obtained.id]), 10);
    const fullVal = parseInt(normalizeValue(form[fullMarksField.id]), 10);

    if (!isNaN(obtainedVal) && !isNaN(fullVal) && obtainedVal > fullVal) {
      errors.push(
        `${obtained.label} must not be greater than ${fullMarksField.label} (${fullVal})`
      );
    }
  }

  return errors;
}

