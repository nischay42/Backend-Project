import { useState } from 'react'
import { 
  MessageCircle, 
  Mail, 
  FileQuestion, 
  ChevronDown, 
  ChevronUp,
  Send,
  CheckCircle2,
  AlertCircle,
  Book,
  Video,
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import { FaGithub,  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useToastContext } from '../context/ToastContext'

const Support = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'resources'>('faq')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToastContext()

  const faqs = [
    {
      category: 'Getting Started',
      icon: Zap,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner, enter your email, username, and password, then verify your email address. You\'ll be ready to start uploading and watching videos!'
        },
        {
          question: 'How do I upload a video?',
          answer: 'After logging in, click on your profile icon and select "Upload Video". Choose your video file (MP4, WebM, or MOV), add a title, description, thumbnail, and category, then click "Publish".'
        },
        {
          question: 'What video formats are supported?',
          answer: 'We support MP4, WebM, and MOV formats. For best quality, we recommend H.264 video codec with AAC audio. Maximum file size is 2GB per video.'
        }
      ]
    },
    {
      category: 'Account & Settings',
      icon: Shield,
      questions: [
        {
          question: 'How do I change my password?',
          answer: 'Go to Settings > Security, enter your current password, then your new password twice. Click "Update Password" to save changes.'
        },
        {
          question: 'Can I change my username?',
          answer: 'Yes! Go to Settings > Profile, click on your username field, enter your new username, and save. Note that your channel URL will also change.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Account, scroll to the bottom, and click "Delete Account". This action is permanent and cannot be undone. All your videos and data will be removed.'
        }
      ]
    },
    {
      category: 'Videos & Content',
      icon: Video,
      questions: [
        {
          question: 'How do I create a playlist?',
          answer: 'Click on any video\'s menu (three dots), select "Save to Playlist", then click "Create New Playlist". Give it a name and choose privacy settings.'
        },
        {
          question: 'Can I edit my video after uploading?',
          answer: 'Yes! Go to your channel, find the video, click the menu, and select "Edit". You can change the title, description, thumbnail, and category.'
        },
        {
          question: 'How do I make a video private?',
          answer: 'When uploading or editing a video, toggle the "Public/Private" switch. Private videos are only visible to you.'
        }
      ]
    },
    {
      category: 'Playback & Features',
      icon: Book,
      questions: [
        {
          question: 'How do I adjust video quality?',
          answer: 'Click the settings icon (gear) in the video player and select your preferred quality. We automatically adjust based on your connection speed.'
        },
        {
          question: 'What are keyboard shortcuts?',
          answer: 'Space/K = Play/Pause, ← → = Skip 10s, ↑ ↓ = Volume, M = Mute, F = Fullscreen. Hover over any control for tooltips!'
        },
        {
          question: 'How does Watch Later work?',
          answer: 'Click the clock icon on any video to add it to Watch Later. Access your list from the sidebar anytime to continue watching.'
        }
      ]
    }
  ]

  const resources = [
    {
      title: 'Video Guidelines',
      description: 'Learn about our content policies and best practices',
      icon: FileQuestion,
      link: '#'
    },
    {
      title: 'Creator Academy',
      description: 'Tips and tutorials for growing your channel',
      icon: Book,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Integrate our platform into your apps',
      icon: Globe,
      link: '#'
    },
    {
      title: 'Community Forums',
      description: 'Connect with other creators and users',
      icon: MessageCircle,
      link: '#'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 md:p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            How can we help you?
          </h1>
          <p className="text-gray-400 text-lg">
            Get answers, find resources, or reach out to our support team
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-400">Support Available</div>
          </div>
          <div className="bg-linear-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-6 text-center">
            <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">&lt;2hrs</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
          <div className="bg-linear-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-400">98%</div>
            <div className="text-sm text-gray-400">Satisfaction Rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-4 px-6 font-medium transition-all ${
              activeTab === 'faq'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileQuestion className="w-5 h-5 inline-block mr-2" />
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-4 px-6 font-medium transition-all ${
              activeTab === 'contact'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-5 h-5 inline-block mr-2" />
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-4 px-6 font-medium transition-all ${
              activeTab === 'resources'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Book className="w-5 h-5 inline-block mr-2" />
            Resources
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => {
              const IconComponent = category.icon
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <IconComponent className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-semibold">{category.category}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.questions.map((faq, index) => {
                      const globalIndex = categoryIndex * 100 + index
                      const isExpanded = expandedFaq === globalIndex
                      
                      return (
                        <div
                          key={index}
                          className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all"
                        >
                          <button
                            onClick={() => toggleFaq(globalIndex)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/50 transition-colors"
                          >
                            <span className="font-medium text-lg">{faq.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-purple-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-5 pb-5 text-gray-300 leading-relaxed border-t border-gray-700 pt-4">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8">
              <div className="text-center mb-8">
                <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
                <p className="text-gray-400">
                  We typically respond within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="content">Content Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Alternative Contact Methods */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-gray-400 text-sm text-center mb-4">
                  Or reach us through
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://x.com/nischay42"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/nischay42"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=nischaydilhor@gmail.com"
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    rel="noopener noreferrer"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon
              return (
                <a 
                 key={index}
                  href={resource.link}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {resource.description}
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400 transform -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              )
            })}

            {/* Additional Help Section */}
            <div className="md:col-span-2 bg-linear-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-8 text-center">
              <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Still need help?</h3>
              <p className="text-gray-400 mb-6">
                Our community forums are full of helpful users and staff members
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Visit Community Forums
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Support