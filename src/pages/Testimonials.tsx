import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Linkedin, Mail, ArrowLeft, Quote, Star, Users, GraduationCap, Building2, MessageCircle, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  rating?: number;
}

const menteeTestimonials: Testimonial[] = [
  {
    id: '1',
    text: "I used to feel overwhelmed choosing the right career direction. With MentorConnect, I got matched with a mentor who understood my background and gave me clarity within one session. The built-in video and chat made everything seamless. I didn't even need Zoom or Calendly!",
    author: "Sneha Kulkarni",
    role: "Final Year Engineering Student",
    rating: 5
  },
  {
    id: '2',
    text: "Unlike other platforms that felt transactional, MentorConnect felt human. I could ask questions in the discussion forum without fear of judgment, and mentors were surprisingly responsive.",
    author: "Arjun Mehta",
    role: "Aspiring Data Scientist",
    rating: 5
  },
  {
    id: '3',
    text: "What makes MentorConnect powerful is its simplicity. I logged in, joined a group, and within minutes, I was in a live video session with three mentors. No fees, no friction, just focused guidance.",
    author: "Nikita Sharma",
    role: "MBA Aspirant",
    rating: 5
  }
];

const mentorTestimonials: Testimonial[] = [
  {
    id: '4',
    text: "MentorConnect is the only platform that respects both the mentor's time and the mentee's need. I loved how I could set my availability and mentor students without external plugins or distractions.",
    author: "Dr. Sameer Rane",
    role: "Industry Mentor & Career Coach",
    rating: 5
  },
  {
    id: '5',
    text: "Being able to mentor directly through video, chat, and even forums without any setup headaches was a game-changer. The mentees are driven, and the system makes mentorship feel meaningful again.",
    author: "Ankita Joshi",
    role: "Senior Software Engineer @ TCS",
    rating: 5
  },
  {
    id: '6',
    text: "The psychology of giving back is built into MentorConnect. I've been mentoring for years, but this platform gave me structure and focus. I now run monthly group sessions with 30+ mentees.",
    author: "Ravi Sutar",
    role: "Data Analytics Mentor",
    rating: 5
  }
];

const institutionTestimonials: Testimonial[] = [
  {
    id: '7',
    text: "We included MentorConnect in our campus program, and within a week, over 120 mentorship sessions were conducted—no third-party tools, no coordination nightmares. Just pure, automated, impactful mentorship.",
    author: "Prof. Manisha More",
    role: "T&P Head, Orchid College of Engineering",
    rating: 5
  },
  {
    id: '8',
    text: "Platforms like this are the future of skill development. MentorConnect seamlessly removes the cost and complexity barriers that students from Tier 2/3 cities face.",
    author: "Shraddha Patil",
    role: "Career Consultant",
    rating: 5
  }
];

export function Testimonials() {
  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
    ));
  };

  const renderTestimonialCard = (testimonial: Testimonial) => (
    <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-3">
            {renderStars(testimonial.rating || 5)}
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 italic">
            "{testimonial.text}"
          </p>
          <div className="border-t border-gray-100 pt-4">
            <p className="font-semibold text-gray-900">{testimonial.author}</p>
            <p className="text-sm text-gray-600">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Testimonials</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how MentorConnect is transforming mentorship for students, professionals, and institutions across India
          </p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-100">Mentorship Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-100">Expert Mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mentee Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">🧑‍🎓 Mentee Testimonials</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Students Share Their Success Stories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students who found clarity, guidance, and direction through MentorConnect's seamless mentorship experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menteeTestimonials.map(renderTestimonialCard)}
          </div>
        </section>

        {/* Mentor Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">🎓 Mentor Testimonials</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Mentors Share Their Experience</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why industry professionals and career coaches choose MentorConnect to make a meaningful impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorTestimonials.map(renderTestimonialCard)}
          </div>
        </section>

        {/* Institution Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">💼 Institution/Organizer Perspective</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Institutional Success Stories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how educational institutions and organizations are leveraging MentorConnect to enhance their programs.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {institutionTestimonials.map(renderTestimonialCard)}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Users Love MentorConnect</h3>
            <p className="text-gray-600">The features that make our platform stand out</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Built-in Video Calls</h4>
              <p className="text-gray-600 text-sm">No external tools needed. Seamless video calling experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Discussion Forums</h4>
              <p className="text-gray-600 text-sm">Community-driven learning with no judgment.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Scheduling</h4>
              <p className="text-gray-600 text-sm">Automated scheduling without coordination headaches.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students and mentors who are already benefiting from MentorConnect's innovative platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">MentorConnect</span>
                  <p className="text-sm text-gray-400">Professional Mentorship Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect, learn, and grow with expert mentorship. Our comprehensive platform provides everything you need for career development and professional networking.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/priyankahotkar" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="http://www.linkedin.com/in/priyanka-hotkar-3a667a259" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="mailto:priyankahotkar4@gmail.com?subject=Hello%20Priyanka&body=I%20saw%20your%20website..." className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/users" className="hover:text-white transition-colors">Mentors</a></li>
                <li><a href="/study-materials" className="hover:text-white transition-colors">Study Materials</a></li>
                <li><a href="/discussion-forum" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact-us" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MentorConnect. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 