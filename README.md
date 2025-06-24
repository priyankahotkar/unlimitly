
# MentorConnect

MentorConnect is a free, AI-driven online mentoring platform designed to connect mentees with experienced mentors seamlessly. It integrates automated scheduling, built-in video conferencing, real-time chat, and community discussion forums into a single platform to provide a structured and accessible mentoring experience.

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
**Project Name**: MentorConnect  
**Theme**: Education  
**Team Name**: MentorSync  
**Event**: ORCHATHON 2K25, organized by N.K. Orchid College of Engineering and Technology, Solapur  

MentorConnect aims to eliminate the limitations of existing mentoring platforms by providing a free, all-in-one solution for career guidance, skill development, and professional networking.

## Problem Statement
Many existing mentoring platforms suffer from:
- High costs (e.g., Clarity.fm, MentorCruise, Unstop)
- Lack of integrated scheduling and communication tools (e.g., LinkedIn Mentorship, ADPList)
- Dependency on third-party tools like Calendly and Zoom, causing inefficiencies

MentorConnect addresses these issues by offering a free platform with automated scheduling, built-in video calls, real-time chat, and secure authentication, ensuring a seamless mentoring experience.

## Features
### Mentee-Side Features
- **Dynamic Scheduling**: Book mentorship sessions using Google Calendar integration.
- **Video Conferencing**: Attend secure, built-in video sessions powered by Jitsi Meet.
- **Real-Time Chat**: Communicate with mentors via Firebase-powered chat.
- **Discussion Forum**: Engage with peers and mentors to clear doubts.
- **Filtered FAQs**: Access topic-specific answers to common career queries.
- **Group Video Calls**: Participate in group mentoring via dedicated channels.
- **Group Voice Chats**: Participate in group mentoring via dedicated voice channels.
- **A Completely free all in one solution for everything you need for a good placement**: All resources curated in a single platform. We have brought to you all resources at a single place right from downloads, tutorials to practice and projects everything right at one place.

### Mentor-Side Features
- **Profile Creation**: Showcase expertise, experience, and availability.
- **Flexible Scheduling**: Set time slots for mentoring sessions.
- **1:1 Video Sessions**: Conduct personalized mentoring sessions.
- **Real-Time Support**: Answer mentees' queries via chat.
- **Webinars & Group Sessions**: Host career-related group mentoring.
- **Forum Participation**: Share insights and answer questions in the discussion forum.
- **Create Groups/Channels**: Initiate and manage topic-specific mentoring groups.

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
1. **Requirement Analysis**: Define features like mentor-mentee matching, scheduling, and communication.
2. **System Design**: Architect the platform with scalable frontend and backend components.
3. **Development**: Build UI, APIs, and integrate scheduling, chat, and video features.
4. **Testing & Deployment**: Test functionality, optimize performance, and deploy on Firebase.

## Impact
- **Accessibility**: Free platform with no third-party dependencies.
- **Efficiency**: Automated scheduling reduces delays and miscommunication.
- **Career Growth**: Direct guidance from experts enhances skill development and job readiness.
- **Inclusivity**: Open to students and professionals from diverse backgrounds.
- **Versatility**: Applicable for career guidance, higher education, skill development, and corporate training.

## Live Link
- **Hosted using Firebase hosting**:  
  [View Live Website](https://mentorconnect-fd483.web.app/)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/priyankahotkar/MentorConnect.git
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
- Register as a mentor or mentee.
- Create or join discussion forums and groups.
- Use real-time chat for quick communication.
- Schedule or join mentoring sessions.
- Launch 1:1 or group video calls from the dashboard.

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


© 2025 MentorConnect. All Rights Reserved.
