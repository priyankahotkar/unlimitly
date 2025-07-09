import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Compass, ArrowLeft, User, Mail, Briefcase, BookOpen, Clock, MapPin, Phone, Globe, Edit3, Users, Search, Award, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  detailsCompleted: boolean;
  details?: {
    fullName: string;
    domain: string;
    experience: string;
    education: string;
    year: string;
    organization: string;
    expertise: string;
  };
  availableTimeSlots?: string[];
  createdAt?: any;
  updatedAt?: any;
  // Additional profile fields
  location?: string;
  linkedin?: string;
  github?: string;
  badges?: string[];
  bio?: string;
  phone?: string;
  website?: string;
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'mentor' | 'mentee'>('all');

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersData: UserData[] = [];
        
        snapshot.forEach((doc) => {
          const userData = doc.data() as UserData;
          userData.uid = doc.id;
          // Ensure name is not null/undefined
          if (!userData.name) {
            userData.name = userData.email?.split('@')[0] || 'Unknown User';
          }
          usersData.push(userData);
        });

        // Sort users by name
        usersData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const userName = user.name || '';
    const userEmail = user.email || '';
    const userDomain = user.details?.domain || '';
    const userExpertise = user.details?.expertise || '';
    const userLocation = user.location || '';
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userExpertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleUserClick = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        userData.uid = userSnap.id;
        // Ensure name is not null/undefined
        if (!userData.name) {
          userData.name = userData.email?.split('@')[0] || 'Unknown User';
        }
        setSelectedUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Helper function to get user initials
  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">All Users</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, domain, expertise, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'mentor' | 'mentee')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="mentor">Mentors Only</option>
              <option value="mentee">Mentees Only</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              onClick={() => handleUserClick(user.uid)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photoURL} alt={user.name || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.email || 'No email'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'mentor' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                  </span>
                  {user.detailsCompleted && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Profile Complete
                    </span>
                  )}
                </div>
                
                {user.details?.domain && (
                  <p className="text-sm text-gray-600">
                    <Briefcase className="inline h-3 w-3 mr-1" />
                    {user.details.domain}
                  </p>
                )}
                
                {user.details?.expertise && (
                  <p className="text-sm text-gray-600">
                    <BookOpen className="inline h-3 w-3 mr-1" />
                    {user.details.expertise}
                  </p>
                )}

                {user.location && (
                  <p className="text-sm text-gray-600">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    {user.location}
                  </p>
                )}

                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">{user.badges.length} badge{user.badges.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center space-x-2 pt-1">
                  {user.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Github className="h-3 w-3" />
                    </a>
                  )}
                  {user.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No users are currently registered.'
              }
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <Button variant="ghost" size="sm" onClick={closeUserDetails}>
                  <span className="sr-only">Close</span>
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.photoURL} alt={selectedUser.name || 'User'} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {getUserInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name || 'Unknown User'}</h3>
                    <p className="text-gray-500">{selectedUser.email || 'No email'}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.role === 'mentor' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedUser.role ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) : 'Unknown'}
                      </span>
                      {selectedUser.detailsCompleted && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Profile Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedUser.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Bio</h4>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedUser.bio}</p>
                  </div>
                )}

                {/* User Details */}
                {selectedUser.details && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedUser.details.fullName && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                        <p className="text-gray-900">{selectedUser.details.fullName}</p>
                      </div>
                    )}

                    {selectedUser.details.domain && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          Domain
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.domain}</p>
                      </div>
                    )}

                    {selectedUser.details.experience && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Experience
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.experience}</p>
                      </div>
                    )}

                    {selectedUser.details.organization && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Organization
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.organization}</p>
                      </div>
                    )}

                    {selectedUser.details.expertise && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Expertise
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.expertise}</p>
                      </div>
                    )}

                    {selectedUser.details.education && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Education
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.education}</p>
                      </div>
                    )}

                    {selectedUser.details.year && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Year/Experience
                        </h4>
                        <p className="text-gray-900">{selectedUser.details.year}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Information */}
                {(selectedUser.location || selectedUser.phone || selectedUser.website) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{selectedUser.location}</span>
                        </div>
                      )}
                      {selectedUser.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={selectedUser.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {selectedUser.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(selectedUser.github || selectedUser.linkedin) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Social Links</h4>
                    <div className="flex space-x-4">
                      {selectedUser.github && (
                        <a 
                          href={selectedUser.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {selectedUser.linkedin && (
                        <a 
                          href={selectedUser.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {selectedUser.badges && selectedUser.badges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Badges & Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Time Slots (for mentors) */}
                {selectedUser.role === 'mentor' && selectedUser.availableTimeSlots && selectedUser.availableTimeSlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Available Time Slots
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.availableTimeSlots.map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <p className="text-gray-900 font-mono text-xs">{selectedUser.uid}</p>
                    </div>
                    {selectedUser.createdAt && (
                      <div>
                        <span className="text-gray-500">Member since:</span>
                        <p className="text-gray-900">
                          {selectedUser.createdAt.toDate ? 
                            selectedUser.createdAt.toDate().toLocaleDateString() : 
                            'Unknown'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                {currentUser?.uid !== selectedUser.uid && (
                  <Link to={`/chat`}>
                    <Button onClick={closeUserDetails} className="text-white">
                      <Mail className="h-4 w-4 mr-2 text-white" />
                      Send Message
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={closeUserDetails}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <img src="./logo2.png" alt="Unlimitly" className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-bold">Unlimitly</span>
                  <p className="text-sm text-gray-400">Be Limitless</p>
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
            <p>&copy; 2025 Unlimitly. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 