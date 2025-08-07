# Unlimitly

Unlimitly is a free, AI-driven online mentoring platform designed to connect students with experienced experts seamlessly. It integrates automated scheduling, built-in video conferencing, real-time chat, and community discussion forums into a single platform to provide a structured and accessible mentoring experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technical Design](#technical-design)
- [Impact](#impact)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [References](#references)
- [Team](#team)

## Project Overview

**Project Name**: Unlimitly

Unlimitly aims to eliminate the limitations of existing mentoring platforms by providing a free, all-in-one solution for career guidance, skill development, and professional networking.

## Problem Statement

Many existing mentoring platforms suffer from:

- High costs (e.g., Clarity.fm, MentorCruise, Unstop)
- Lack of integrated scheduling and communication tools (e.g., LinkedIn Expertship, ADPList)
- Dependency on third-party tools like Calendly and Zoom, causing inefficiencies

Unlimitly addresses these issues by offering a free platform with automated scheduling, built-in video calls, real-time chat, and secure authentication, ensuring a seamless mentoring experience.

## Features

### Student-Side Features

- **Dynamic Scheduling**: Book expertship sessions using Google Calendar integration.
- **Video Conferencing**: Attend secure, built-in video sessions powered by Jitsi Meet.
- **Real-Time Chat**: Communicate with experts via Firebase-powered chat.
- **Discussion Forum**: Engage with peers and experts to clear doubts.
- **Filtered FAQs**: Access topic-specific answers to common career queries.
- **Group Video Calls**: Participate in group mentoring via dedicated channels.
- **Group Voice Chats**: Participate in group mentoring via dedicated voice channels.
- **Badges & Progress Tracking**: Earn and display DSA and Machine Learning badges, with progress bars and clear labeling, directly on your profile. Progress is fetched and updated from Firestore.
- **LeetCode-Style Activity Grid**: Visualize your activity over the last 180 days with a modern, color-gradient grid, including month separators and subtle spacing for a clean look.
- **A Completely free all in one solution for everything you need for a good placement**: All resources curated in a single platform. We have brought to you all resources at a single place right from downloads, tutorials to practice and projects everything right at one place.

### Mentor-Side Features

- **Profile Creation**: Showcase expertise, experience, and availability.
- **Flexible Scheduling**: Set time slots for mentoring sessions.
- **1:1 Video Sessions**: Conduct personalized mentoring sessions.
- **Real-Time Support**: Answer students' queries via chat.
- **Webinars & Group Sessions**: Host career-related group mentoring.
- **Forum Participation**: Share insights and answer questions in the discussion forum.
- **Create Groups/Channels**: Initiate and manage topic-specific mentoring groups.
- **Role-Based Profile View**: Mentor profiles display only relevant mentor details, while student profiles show badges, progress, and activity.

### Platform-Wide Features

- **Consistent Footer**: Unified footer across all main pages for branding and navigation.
- **Professional UI/UX**: Modernized headers, improved logout button with icons and tooltips, and visually appealing layouts throughout the app.
- **Protected Routes & Authentication**: Secure private routes with a loading spinner during authentication checks, and automatic redirection to the intended page after login.
- **Bug Fixes & Clean Structure**: Import errors resolved, extra spacing removed, and page structures standardized for a seamless experience.

## Technical Design

### Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database & Authentication**: Firebase
- **Scheduling**: Google Calendar API
- **Video Conferencing**: Jitsi Meet
- **Real-Time Chat**: Firebase
- **Group Video Feature**: Jitsi Meet API integration with role-based control

### Development Process

1. **Requirement Analysis**: Define features like mentor-student matching, scheduling, and communication.
2. **System Design**: Architect the platform with scalable frontend and backend components.
3. **Development**: Build UI, APIs, and integrate scheduling, chat, and video features. Recent updates include advanced profile features (badges, activity grid), role-based rendering, and improved authentication flow with loading states and redirect logic.
4. **Testing & Deployment**: Test functionality, optimize performance, and deploy on Firebase.

## Impact

- **Accessibility**: Free platform with no third-party dependencies.
- **Efficiency**: Automated scheduling reduces delays and miscommunication.
- **Career Growth**: Direct guidance from experts enhances skill development and job readiness.
- **Inclusivity**: Open to students and professionals from diverse backgrounds.
- **Versatility**: Applicable for career guidance, higher education, skill development, and corporate training.

## Live Link

- **Hosted using Firebase hosting**:  
  [View Live Website](https://unlimitly-c1506.web.app/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/priyankahotkar/Unlimitly.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app locally:

   ```bash
   npm run dev
   ```

4. For deployment:
   ```bash
   npm run build
   firebase deploy
   ```

## Usage

- Register as a mentor or student.
- Create or join discussion forums and groups.
- Use real-time chat for quick communication.
- Schedule or join mentoring sessions.
- Launch 1:1 or group video calls from the dashboard.
- Click your profile avatar in the dashboard to view your profile, badges, and activity grid (students) or mentor details (experts).
- Enjoy a consistent experience with unified navigation, footers, and professional UI elements across all pages.

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Jitsi Meet API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- [React.js](https://reactjs.org/)
- [Google Calendar API](https://developers.google.com/calendar)

## Recent Updates

- **Badges & Progress Tracking**: DSA and ML badges with progress bars for students, fetched from Firestore.
- **LeetCode-Style Activity Grid**: 180-day activity grid with month separators and color gradients.
- **Role-Based Profile View**: Mentor profiles show only mentor details; student profiles show badges and progress.
- **Consistent Footer**: Unified footer across all main pages.
- **Improved Authentication**: Loading spinner during auth check and redirect to intended page after login.
- **UI/UX Improvements**: Professional headers, improved logout button, and modernized grid and spacing.
- **Bug Fixes**: Import errors resolved, extra spacing removed, and page structures standardized.

© 2025 Unlimitly. All Rights Reserved.
