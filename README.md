# Diploma Code Hub

Project Title: Diploma Student Coding Assessment Portal

Project Overview

Create a modern, responsive, professional web application for a Diploma College where faculty can conduct coding quizzes for students.

The system should support multiple years, departments, sections, and subjects while providing a secure Admin Panel to manage questions.

The design should look modern, clean, premium, and mobile-friendly with smooth animations.

User Roles

1. Student

 Can select their academic details

 Can attend available coding tests

 Can view score after submission

 Cannot edit answers after submitting

2. Admin (Faculty)

 Secure Login

 Dashboard

 Add Questions

 Edit Questions

 Delete Questions

 Create New Tests

 View Student Results

 Export Results

 Manage Students

Home Page

Beautiful landing page containing

 College Logo

 Website Name

 Hero Section

 Illustration

 Start Test Button

 About Website

 Features

 Footer

Student Flow

Student clicks

Start Test

↓

Select

Academic Year

Options

 First Year

 Second Year

 Final Year

↓

Select Department

Examples

 CME

 CSE

 ECE

 EEE

 ME

 Civil

↓

Select Section

 A

 B

 C

 D

↓

Enter Student Details

 Full Name

 Hall Ticket Number

 Branch

 Section

 Year

↓

Click Continue

↓

System automatically loads only that student's assigned test.

Example

Second Year

↓

CME

↓

Section C

↓

Only

Second Year → CME → Section C Questions

must appear.

Students should never see questions from another year or section.

Test Page

Show

Question Number

Question

Options

Next Button

Previous Button

Question Palette

Timer

Progress Bar

Auto Save

Submit Button

Confirmation before submit.

Question Types

Support

Multiple Choice Questions

Single Correct Answer

Future ready architecture for

Coding Questions

Paragraph Questions

Fill in the Blanks

True/False

Results Page

Show

Student Name

Hall Ticket

Branch

Section

Year

Score

Percentage

Correct Answers

Wrong Answers

Time Taken

Performance Badge

Excellent

Good

Average

Needs Improvement

Admin Login

Separate page

Only Admin can access.

Secure login screen

Username

Password

Remember Me

Forgot Password (placeholder)

Admin Dashboard

Professional sidebar

Dashboard

Manage Questions

Manage Tests

Students

Results

Analytics

Settings

Logout

Question Management

Admin should be able to

Add Question

Edit Question

Delete Question

Duplicate Question

Preview Question

Search Question

Filter Questions

Questions must be categorized by

Year

Department

Section

Subject

Difficulty

Add Question Form

Fields

Academic Year

Department

Section

Subject

Question

Option A

Option B

Option C

Option D

Correct Answer

Difficulty

Marks

Explanation

Save Button

Test Management

Admin can

Create Test

Publish Test

Disable Test

Set Test Duration

Shuffle Questions

Shuffle Options

Assign Test to

Year

Department

Section

Only assigned students should receive that test.

Student Management

Admin can

View students

Search students

Filter students

Delete students

Reset attempt

Results Management

Admin can

View Results

Search

Sort

Filter

Export CSV

Export PDF

Print Report

Analytics Dashboard

Cards

Total Students

Tests Conducted

Average Score

Highest Score

Lowest Score

Department Performance

Year-wise Performance

Section-wise Performance

Charts

Bar Chart

Pie Chart

Line Chart

Database Structure

Students

student_id

hall_ticket

name

year

department

section

created_at

Questions

question_id

year

department

section

subject

question

option_a

option_b

option_c

option_d

correct_answer

difficulty

marks

Tests

test_id

year

department

section

subject

duration

status

created_at

Results

result_id

student_id

test_id

score

percentage

correct

wrong

time_taken

submitted_at

Admins

admin_id

username

password_hash

role

UI Requirements

Modern Dashboard

Glassmorphism

Rounded Cards

Dark/Light Theme

Responsive Design

Professional Animations

Loading Screen

Toast Notifications

Smooth Page Transitions

Premium Icons

Breadcrumb Navigation

Sticky Sidebar

Responsive Tables

Search Everywhere

Pagination

Security

Admin Authentication

Role-based Access

Input Validation

Prevent Duplicate Submissions

Session Management

Secure Password Hashing

CSRF Protection

SQL Injection Protection

XSS Protection

Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

ShadCN UI

Framer Motion

React Router

Backend

Supabase (Authentication + PostgreSQL Database + Storage)

or

Firebase Authentication + Firestore

Charts

Recharts

Tables

TanStack Table

Forms

React Hook Form

Validation

Zod

Folder Structure

src/
 pages/
   Home
   Student
   Admin
   Login
   Dashboard
   Test
   Results
 components/
 layouts/
 hooks/
 services/
 utils/
 context/
 types/
 assets/

Future Features

 AI-generated coding questions

 Programming code editor

 Auto code evaluation

 Email notifications

 Leaderboard

 Certificates

 Question import from Excel

 Multi-language support

 OTP login

 Attendance integration

 Student profile page

Expected Output

Generate a complete production-ready multi-page website with:

 Clean, modular React code

 Fully responsive UI

 Supabase backend integration

 Authentication

 CRUD operations for questions

 Student test workflow

 Admin dashboard

 Analytics dashboard

 Reusable components

 Well-organized folder structure

 Easy-to-maintain code with comments and best practices.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://codeandcreativityclub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b5625ce-2bae-49c9-955c-6bb6ca032724).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
