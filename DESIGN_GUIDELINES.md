# PeopleHub — Design & UI Guidelines

## 1. Design Goal

PeopleHub is a professional internal **Employee Management System** used by administrators.

The interface should feel:

* Professional
* Clean
* Modern
* Minimal
* Trustworthy
* Corporate
* Easy to scan
* Comfortable for long-term daily use

Avoid overly colorful, playful, futuristic, or flashy designs.

The UI should look like a real business SaaS product.

---

# 2. Design Philosophy

Follow these principles:

1. Keep the interface simple.
2. Prioritize readability over decoration.
3. Use consistent spacing everywhere.
4. Use cards and sections to organize information.
5. Keep actions obvious.
6. Use color mainly to communicate status or importance.
7. Avoid unnecessary animations.
8. Maintain strong visual hierarchy.
9. Keep employee information easy to scan.
10. Every page should feel like part of the same product.

---

# 3. Color System

Use the following colors consistently.

## Primary

```text
Primary:        #2563EB
Primary Hover:  #1D4ED8
Primary Light:  #EFF6FF
```

Use primary blue for:

* Main buttons
* Active navigation
* Links
* Important actions
* Selected states
* Focus states

Do not use primary blue everywhere.

---

## Background

```text
Main Background:       #F8FAFC
Card Background:       #FFFFFF
Secondary Background:  #F1F5F9
```

The application should mainly use a very light gray background with white cards.

---

## Text

```text
Primary Text:     #0F172A
Secondary Text:   #475569
Muted Text:       #64748B
Disabled Text:    #94A3B8
```

Use dark text for headings and important information.

Use gray text for supporting information.

---

## Borders

```text
Border:           #E2E8F0
Border Strong:    #CBD5E1
```

Borders should be subtle.

Avoid heavy borders.

---

# 4. Status Colors

Use status colors only when communicating a meaningful state.

## Active / Success

```text
Green:        #16A34A
Green Light:  #DCFCE7
```

Examples:

* Active employee
* Successful operation
* Completed action

## Warning

```text
Amber:        #D97706
Amber Light:  #FEF3C7
```

Examples:

* Pending
* Warning
* Review required

## Danger

```text
Red:        #DC2626
Red Light:  #FEE2E2
```

Examples:

* Delete
* Terminated employee
* Error
* Critical warning

## Archived / Neutral

```text
Gray:        #64748B
Gray Light:  #F1F5F9
```

---

# 5. Typography

Use a clean modern sans-serif font.

Preferred:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## Typography hierarchy

### Page Title

```text
24px - 30px
font-weight: 600
```

### Section Heading

```text
18px - 20px
font-weight: 600
```

### Card Heading

```text
16px - 18px
font-weight: 600
```

### Body

```text
14px - 16px
font-weight: 400
```

### Small / Metadata

```text
12px - 14px
font-weight: 400
```

Avoid excessive font sizes.

---

# 6. Border Radius

Use moderately rounded corners.

```text
Small elements:  6px
Inputs:          8px
Buttons:         8px
Cards:           12px
Large sections:  16px
```

Avoid extremely rounded/pill-shaped components unless they represent a status badge.

---

# 7. Shadows

Use subtle shadows only.

Preferred:

```text
0 1px 3px rgba(15, 23, 42, 0.08)
```

For elevated elements:

```text
0 4px 12px rgba(15, 23, 42, 0.08)
```

Avoid strong or dramatic shadows.

---

# 8. Layout

The application should use a dashboard layout.

```text
┌──────────────────────────────────────────────────┐
│ Sidebar │ Top Navigation                         │
│         ├────────────────────────────────────────┤
│         │                                        │
│         │ Main Content                           │
│         │                                        │
│         │                                        │
│         │                                        │
└──────────────────────────────────────────────────┘
```

## Sidebar

Desktop sidebar:

```text
Width: 240px - 260px
```

Contents:

```text
PeopleHub Logo

Dashboard
Employees
Archive
Projects
Documents
Settings

Logout
```

The active navigation item should use:

```text
Background: #EFF6FF
Text:       #2563EB
```

Inactive navigation should use muted gray text.

---

# 9. Top Navigation

The top navigation should contain:

* Page title
* Optional breadcrumb
* Search where appropriate
* Admin profile
* Notification icon if needed

Keep it clean and compact.

---

# 10. Dashboard

The dashboard should immediately communicate the state of the workforce.

Example:

```text
Dashboard

Good morning, Admin
Here's what's happening with your employees.

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Employees  │ │ Active     │ │ Archived   │ │ New        │
│    42      │ │    38      │ │     4      │ │     3      │
└────────────┘ └────────────┘ └────────────┘ └────────────┘

Recent Employees

┌────────────────────────────────────────────────────┐
│ Employee                                          │
│ Photo  Name       Role       Project      Status  │
└────────────────────────────────────────────────────┘
```

Statistics cards should be simple.

Do not overuse icons or decorative graphics.

---

# 11. Employee Cards

Employee cards should display:

* Profile picture
* Full name
* Role
* City
* Current project
* Status

Example structure:

```text
┌──────────────────────────────┐
│                              │
│   [Photo]   Muhammad Umair   │
│              Software Eng.   │
│                              │
│   Islamabad                  │
│   Project: PeopleHub         │
│                              │
│   ● Active                   │
└──────────────────────────────┘
```

The employee photo should be:

```text
64px - 80px
border-radius: 50%
object-fit: cover
```

---

# 12. Employee Profile

The employee profile is one of the most important screens.

Use a clear hierarchy.

```text
Employee Profile

┌──────────────────────────────────────────────┐
│ [PHOTO]  Muhammad Umair                      │
│          Software Engineer                   │
│          ● Active                            │
│                                              │
│          Edit Employee       Archive         │
└──────────────────────────────────────────────┘

Personal Information

┌──────────────────────────────────────────────┐
│ Email        Phone                           │
│ City         Address                         │
│                                              │
└──────────────────────────────────────────────┘

Employment Information

┌──────────────────────────────────────────────┐
│ Role             Department                  │
│ Manager          Joining Date                │
│ Current Project                              │
└──────────────────────────────────────────────┘

Admin Feedback

┌──────────────────────────────────────────────┐
│ Feedback entry...                            │
└──────────────────────────────────────────────┘
```

Organize information into logical sections instead of putting everything into one large card.

---

# 13. Forms

Forms must be clean and easy to complete.

Input style:

```text
Background: #FFFFFF
Border: #E2E8F0
Radius: 8px
Height: approximately 40px - 44px
```

Focus state:

```text
Border: #2563EB
```

Labels should appear above inputs.

Example:

```text
Full Name

[ Muhammad Umair                         ]

Email

[ admin@example.com                      ]
```

Required fields should be clearly indicated.

---

# 14. Buttons

## Primary Button

```text
Background: #2563EB
Text: #FFFFFF
```

Examples:

```text
+ Add Employee
Save Employee
Update Employee
```

## Secondary Button

```text
Background: #FFFFFF
Border: #E2E8F0
Text: #334155
```

Examples:

```text
Cancel
Back
View Details
```

## Danger Button

```text
Background: #DC2626
Text: #FFFFFF
```

Use only for destructive actions.

Examples:

```text
Delete
Terminate Employee
```

Never make destructive actions visually dominant unless necessary.

---

# 15. Status Badges

Use compact badges.

Example:

```text
● Active
```

```text
● Archived
```

```text
● On Leave
```

Use:

```text
padding: 4px 10px
border-radius: 9999px
font-size: 12px
```

---

# 16. Tables

For larger employee lists, use tables instead of cards.

Columns can include:

```text
Employee
Role
Department
Project
Joining Date
Status
Actions
```

Keep table rows clean.

Use hover feedback:

```text
background: #F8FAFC
```

Do not use excessive grid lines.

---

# 17. Archive Page

The archive should feel visually different from active employees but still belong to the same system.

Display:

* Employee photo
* Name
* Role
* Joining date
* Leaving date
* Reason for leaving
* Rehire eligibility

Use neutral/gray styling for archived status.

Danger red should only be used when the reason/action actually requires warning.

---

# 18. Modal Design

Use modals for:

* Delete confirmation
* Archive employee
* Important confirmations

Modal:

```text
Width: 400px - 500px
Background: #FFFFFF
Border radius: 12px
Padding: 24px
```

Example:

```text
Archive Employee?

Are you sure you want to archive
Muhammad Umair?

Reason for leaving

[ Select reason... ]

        Cancel     Archive Employee
```

---

# 19. Notifications

Use toast notifications for completed actions.

Examples:

```text
Employee added successfully.
```

```text
Employee updated successfully.
```

```text
Employee archived successfully.
```

```text
Something went wrong.
```

Keep notifications short.

---

# 20. Loading States

Never leave the user staring at a blank page.

Use:

* Skeleton loaders
* Loading spinners
* Disabled buttons during submission

Example:

```text
[ Saving... ]
```

instead of:

```text
[ Save Employee ]
```

---

# 21. Empty States

When there is no data, provide a useful message.

Example:

```text
No employees found

There are currently no employees matching
your search or filters.

[ Add Employee ]
```

Avoid empty white spaces with no explanation.

---

# 22. Error States

Errors should be clear and human-friendly.

Bad:

```text
ERR_NETWORK_401
```

Good:

```text
Unable to load employees.
Please try again.
```

---

# 23. Icons

Use **Lucide React** icons.

Use icons only when they improve understanding.

Preferred examples:

```text
LayoutDashboard
Users
Archive
FolderKanban
FileText
Settings
LogOut
Plus
Search
Edit
Trash2
Eye
MoreHorizontal
Calendar
MapPin
Mail
Phone
```

Do not mix different icon libraries.

Keep icons consistent in size.

Typical sizes:

```text
16px
18px
20px
24px
```

---

# 24. Images

Employee profile pictures should always:

```text
object-fit: cover
```

Use fallback initials if no profile image exists.

Example:

```text
MU
```

Do not distort employee images.

---

# 25. Responsive Design

The system must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop:

```text
Sidebar visible
Multi-column layouts
```

Mobile:

```text
Collapsed sidebar
Single-column content
Stacked cards
Horizontal scrolling tables when necessary
```

Never allow important information to overflow outside the screen.

---

# 26. Animations

Animations should be subtle.

Allowed:

* Button hover
* Card hover
* Sidebar transitions
* Modal appearance
* Loading animations

Use short transitions:

```text
150ms - 200ms
```

Avoid:

* Excessive bouncing
* Large page transitions
* Flashy animations
* Unnecessary motion

---

# 27. Spacing System

Prefer consistent spacing based on multiples of 4.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
```

Common page padding:

```text
24px - 32px
```

Card padding:

```text
16px - 24px
```

---

# 28. Dark Mode

Dark mode is optional.

Do not implement dark mode unless specifically requested.

If implemented later, maintain the same hierarchy and contrast.

---

# 29. Accessibility

Always:

* Use semantic HTML.
* Provide labels for inputs.
* Use proper button elements.
* Maintain keyboard accessibility.
* Provide meaningful alt text for employee images.
* Maintain sufficient color contrast.
* Never communicate important information through color alone.

---

# 30. Tailwind CSS Rules

Prefer Tailwind utility classes.

Do not create unnecessary custom CSS.

Use consistent classes such as:

```text
bg-slate-50
bg-white
text-slate-900
text-slate-600
text-slate-500
border-slate-200
bg-blue-600
hover:bg-blue-700
rounded-lg
rounded-xl
shadow-sm
```

Avoid arbitrary values unless there is a real design requirement.

Do not introduce another CSS framework.

---

# 31. Component Consistency

Create reusable components instead of repeating UI.

Examples:

```text
Button
Input
Select
Modal
Badge
Card
Avatar
Table
SearchBar
PageHeader
StatCard
EmptyState
LoadingState
```

If the same UI pattern appears more than once, consider making it a reusable component.

---

# 32. Design Rules for Copilot

When implementing any new feature:

1. Read this `DESIGN_GUIDELINES.md` file first.
2. Follow the existing design system.
3. Reuse existing components whenever possible.
4. Do not introduce new colors without a strong reason.
5. Do not introduce another UI library.
6. Do not change the primary color.
7. Keep spacing consistent.
8. Keep typography consistent.
9. Keep border radius consistent.
10. Keep buttons consistent.
11. Keep forms consistent.
12. Keep status colors consistent.
13. Make all new pages responsive.
14. Prefer simple layouts over decorative layouts.
15. Do not redesign existing pages when implementing an unrelated feature.
16. Do not create unnecessary animations.
17. Do not add gradients unless explicitly requested.
18. Do not use excessive shadows.
19. Do not use huge headings.
20. Maintain the professional corporate SaaS appearance.

---

# 33. Overall Visual Direction

The final product should feel similar to a modern professional SaaS dashboard:

```text
Clean
     ↓
Professional
     ↓
Organized
     ↓
Readable
     ↓
Trustworthy
```

The design should communicate:

**"This is a serious internal company tool."**

not:

**"This is a flashy demo website."**

Always prioritize usability and consistency over visual effects.
