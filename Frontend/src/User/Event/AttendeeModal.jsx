import React from 'react';
import { FiX, FiMail, FiUser, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const AttendeeModal = ({ attendees, onClose, eventTitle }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Event Attendees</h2>
              <p className="text-sm text-gray-600 mt-1">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          {attendees && attendees.length > 0 ? (
            <>
              {/* Stats Bar */}
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Total Attendees: {attendees.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" />
                    <span className="font-medium text-green-900">
                      Verified: {attendees.filter(a => a.email_verified_at).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendees.map((attendee, index) => (
                      <tr key={attendee.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                              {attendee.name ? attendee.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {attendee.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {attendee.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiMail className="text-gray-400 mr-2" size={16} />
                            <div className="text-sm text-gray-900">{attendee.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            attendee.role === 'alumni' 
                              ? 'bg-blue-100 text-blue-800'
                              : attendee.role === 'student'
                              ? 'bg-green-100 text-green-800'
                              : attendee.role === 'faculty'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {attendee.role ? attendee.role.charAt(0).toUpperCase() + attendee.role.slice(1) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendee.email_verified_at ? (
                            <div className="flex items-center">
                              <FiCheckCircle className="text-green-500 mr-1" size={16} />
                              <span className="text-sm text-green-700 font-medium">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></div>
                              <span className="text-sm text-yellow-700 font-medium">Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-400 mr-2" size={16} />
                            {attendee.created_at 
                              ? new Date(attendee.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiUser size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendees Yet</h3>
              <p className="text-gray-500">This event doesn't have any registered attendees.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeModal;