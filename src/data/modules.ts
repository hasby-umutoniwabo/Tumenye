export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonData[];
}

export interface LessonData {
  id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const modules: Module[] = [
  {
    id: 'microsoft-word',
    title: 'Microsoft Word Basics',
    description: 'Learn essential document creation and editing skills',
    icon: 'FileText',
    lessons: [
      {
        id: 'word-lesson-1',
        title: 'Getting Started with Microsoft Word',
        content: `
# Getting Started with Microsoft Word

Welcome to Microsoft Word! This lesson will introduce you to the basics of document creation and editing.

## What is Microsoft Word?
Microsoft Word is a word processing application that allows you to create, edit, and format text documents. It's one of the most widely used applications in offices, schools, and homes worldwide.

## Opening Microsoft Word
1. Click on the Start menu
2. Type "Word" in the search box
3. Click on "Microsoft Word" from the results
4. The application will open with a blank document

## The Word Interface
- **Ribbon**: Contains all the tools and commands organized in tabs
- **Document Area**: Where you type and edit your text
- **Status Bar**: Shows information about your document

## Basic Text Entry
Simply click in the document area and start typing. Your text will appear where the cursor is positioned.

## Saving Your Document
1. Press Ctrl+S (or Cmd+S on Mac)
2. Choose a location to save your file
3. Give your document a name
4. Click "Save"

Great job! You've learned the basics of Microsoft Word.
        `,
        quiz: [
          {
            question: 'What is Microsoft Word primarily used for?',
            options: [
              'Creating spreadsheets',
              'Word processing and document creation',
              'Making presentations',
              'Photo editing'
            ],
            correctAnswer: 1
          },
          {
            question: 'How do you save a document in Microsoft Word?',
            options: [
              'Press Ctrl+S',
              'Go to File menu and click Save',
              'Use the Save button in the toolbar',
              'All of the above'
            ],
            correctAnswer: 3
          },
          {
            question: 'Which part of Word contains all the tools and commands?',
            options: [
              'Status Bar',
              'Document Area',
              'Ribbon',
              'Title Bar'
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'word-lesson-2',
        title: 'Basic Formatting and Editing',
        content: `
# Basic Formatting and Editing

Now that you know how to open Word and create documents, let's learn about formatting text and basic editing features.

## Selecting Text
Before formatting text, you need to select it:
- **Single word**: Double-click on the word
- **Paragraph**: Triple-click in the paragraph
- **All text**: Press Ctrl+A (Cmd+A on Mac)
- **Custom selection**: Click and drag over the text

## Text Formatting
### Making Text Bold, Italic, or Underlined
- **Bold**: Select text and press Ctrl+B or click the Bold button
- **Italic**: Select text and press Ctrl+I or click the Italic button
- **Underline**: Select text and press Ctrl+U or click the Underline button

### Changing Font Size
1. Select the text you want to change
2. Click on the font size dropdown in the Home tab
3. Choose your desired size

## Copy, Cut, and Paste
- **Copy**: Ctrl+C (copies selected text)
- **Cut**: Ctrl+X (cuts selected text)
- **Paste**: Ctrl+V (pastes copied/cut text)

## Undo and Redo
- **Undo**: Ctrl+Z (undoes the last action)
- **Redo**: Ctrl+Y (redoes the last undone action)

## Find and Replace
- Press Ctrl+F to find specific text in your document
- Press Ctrl+H to find and replace text

These basic editing skills will make you much more efficient when working with documents!
        `,
        quiz: [
          {
            question: 'How do you make text bold in Microsoft Word?',
            options: [
              'Press Ctrl+B',
              'Click the Bold button',
              'Select text first, then apply bold',
              'All of the above'
            ],
            correctAnswer: 3
          },
          {
            question: 'What keyboard shortcut is used to copy text?',
            options: [
              'Ctrl+C',
              'Ctrl+V',
              'Ctrl+X',
              'Ctrl+Z'
            ],
            correctAnswer: 0
          },
          {
            question: 'How do you select all text in a document?',
            options: [
              'Triple-click',
              'Ctrl+A',
              'Double-click',
              'Click and drag'
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: 'powerpoint-basics',
    title: 'PowerPoint Basics',
    description: 'Create engaging presentations with confidence',
    icon: 'Presentation',
    lessons: [
      {
        id: 'ppt-lesson-1',
        title: 'Introduction to PowerPoint',
        content: `
# Introduction to PowerPoint

Microsoft PowerPoint is a powerful presentation software that helps you create engaging slides for various purposes.

## What is PowerPoint?
PowerPoint is a presentation program that allows you to create slides with text, images, charts, and multimedia elements.

## The PowerPoint Interface
- **Slide Thumbnail Pane**: Shows miniature versions of your slides
- **Slide Editing Area**: Where you create and edit your slide content
- **Notes Pane**: Add speaker notes for each slide
- **Ribbon**: Contains all the tools and commands you need

## Creating Your First Presentation
1. Open PowerPoint
2. Choose a template or start with a blank presentation
3. Add content to your slides
4. Apply consistent formatting
5. Save your presentation

## Slide Layouts
PowerPoint offers various slide layouts:
- **Title Slide**: For your presentation's opening
- **Content Slide**: For main information with bullet points
- **Two Content**: For side-by-side information
- **Picture with Caption**: For image-focused slides
- **Blank**: For complete customization

## Basic Slide Elements
- **Text Boxes**: Add and format text
- **Images**: Insert pictures and graphics  
- **Shapes**: Add geometric shapes and arrows
- **Charts**: Display data visually
- **Tables**: Organize information in rows and columns

## Design Tips
- Keep slides simple and uncluttered
- Use consistent fonts and colors
- Make text large enough to read
- Use high-quality images
- Limit bullet points per slide

PowerPoint is an essential tool for creating professional presentations in academic and business settings.
        `,
        quiz: [
          {
            question: 'What is the main purpose of PowerPoint?',
            options: [
              'Creating spreadsheets',
              'Creating presentations',
              'Writing documents',
              'Managing databases'
            ],
            correctAnswer: 1
          },
          {
            question: 'Which pane shows miniature versions of your slides?',
            options: [
              'Notes Pane',
              'Slide Editing Area',
              'Slide Thumbnail Pane',
              'Ribbon'
            ],
            correctAnswer: 2
          },
          {
            question: 'What should you do to make your slides more readable?',
            options: [
              'Use many different fonts',
              'Make text large enough to read',
              'Add as much text as possible',
              'Use dark colors only'
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 'ppt-lesson-2',
        title: 'Designing Effective Slides',
        content: `
# Designing Effective Slides

Good slide design is crucial for delivering impactful presentations that engage your audience.

## Design Principles
### 1. Simplicity
- One main idea per slide
- Minimal text and elements
- Clean, uncluttered layout
- White space is your friend

### 2. Consistency
- Use the same fonts throughout
- Maintain consistent colors
- Keep formatting uniform
- Apply the same style to similar elements

### 3. Contrast
- Dark text on light backgrounds
- Light text on dark backgrounds
- Avoid low-contrast combinations
- Make important elements stand out

## Typography Best Practices
### Font Selection
- **Sans-serif fonts** for presentations (Arial, Calibri, Helvetica)
- **Maximum 2 font families** per presentation
- **Minimum 24pt font size** for body text
- **Minimum 32pt font size** for headings

### Text Hierarchy
- **Title**: Largest, boldest text
- **Headings**: Medium size, clear distinction
- **Body text**: Smaller but still readable
- **Captions**: Smallest text size

## Color Guidelines
### Choosing Colors
- Use your organization's brand colors
- Stick to 3-4 colors maximum
- Consider color psychology
- Test colors on different screens

### Accessibility
- Ensure sufficient color contrast
- Don't rely on color alone to convey information
- Consider colorblind users
- Use patterns or shapes alongside color

## Layout Techniques
### The Rule of Thirds
- Divide slide into 9 equal sections
- Place important elements at intersection points
- Creates more dynamic, interesting layouts
- Avoids centered, static designs

### Alignment
- **Left-align** most text for easy reading
- **Center-align** titles and short phrases
- **Avoid justified text** in presentations
- **Align elements** to create clean lines

## Visual Elements
### Images
- Use high-resolution images (300 DPI minimum)
- Ensure images relate to your content
- Avoid cheesy stock photos
- Consider using custom graphics or icons

### Charts and Graphs
- Keep charts simple and clear
- Use appropriate chart types for your data
- Label axes and provide legends
- Use consistent colors across charts

## Common Design Mistakes to Avoid
- **Too much text** on one slide
- **Reading directly** from slides
- **Inconsistent formatting**
- **Poor image quality**
- **Overwhelming animations**
- **Cluttered layouts**

Remember: Your slides should support your presentation, not replace it!
        `,
        quiz: [
          {
            question: 'What is the recommended minimum font size for body text in presentations?',
            options: [
              '18pt',
              '24pt',
              '32pt',
              '16pt'
            ],
            correctAnswer: 1
          },
          {
            question: 'How many font families should you use maximum in a presentation?',
            options: [
              '1',
              '2',
              '3',
              '4'
            ],
            correctAnswer: 1
          },
          {
            question: 'What is the main purpose of using charts and graphs in presentations?',
            options: [
              'Making slides look busy',
              'Filling empty space',
              'Showing relationships and processes',
              'Writing text'
            ],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  {
    id: 'excel-beginners',
    title: 'Excel for Beginners',
    description: 'Master spreadsheet fundamentals and basic calculations',
    icon: 'Sheet',
    lessons: [
      {
        id: 'excel-lesson-1',
        title: 'Introduction to Excel',
        content: `
# Introduction to Excel

Microsoft Excel is a powerful spreadsheet application that helps you organize, calculate, and analyze data.

## What is a Spreadsheet?
A spreadsheet is a document made up of rows and columns that form cells. Each cell can contain text, numbers, or formulas.

## The Excel Interface
- **Columns**: Labeled with letters (A, B, C, etc.)
- **Rows**: Labeled with numbers (1, 2, 3, etc.)
- **Cells**: The intersection of a row and column (e.g., A1, B2, C3)
- **Formula Bar**: Shows the content of the selected cell
- **Worksheet Tabs**: Allow you to work with multiple sheets

## Navigating Excel
- Click on any cell to select it
- Use arrow keys to move between cells
- Press Tab to move to the next cell to the right
- Press Enter to move to the cell below

## Entering Data
1. Click on a cell to select it
2. Type your data (text, numbers, or formulas)
3. Press Enter to confirm the entry

## Basic Cell Operations
- **Edit a cell**: Double-click the cell or press F2
- **Delete content**: Select cell and press Delete
- **Clear content**: Right-click and choose "Clear Contents"

## Saving Your Workbook
Just like Word, use Ctrl+S to save your Excel workbook.

Excel is an essential tool for organizing and analyzing data in both personal and professional settings.
        `,
        quiz: [
          {
            question: 'What do you call the intersection of a row and column in Excel?',
            options: [
              'Grid',
              'Cell',
              'Box',
              'Square'
            ],
            correctAnswer: 1
          },
          {
            question: 'How are columns labeled in Excel?',
            options: [
              'With numbers',
              'With letters',
              'With symbols',
              'With colors'
            ],
            correctAnswer: 1
          },
          {
            question: 'What key do you press to move to the cell below?',
            options: [
              'Tab',
              'Space',
              'Enter',
              'Shift'
            ],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  {
    id: 'online-safety',
    title: 'Online Safety & Critical Thinking',
    description: 'Stay safe online and develop digital literacy skills',
    icon: 'Shield',
    lessons: [
      {
        id: 'safety-lesson-1',
        title: 'Password Security and Safe Browsing',
        content: `
# Password Security and Safe Browsing

In our digital world, protecting yourself online is crucial. This lesson covers essential online safety practices.

## Password Security
### Creating Strong Passwords
A strong password should be:
- At least 12 characters long
- Include uppercase and lowercase letters
- Contain numbers and special characters
- Unique for each account
- Not contain personal information

### Examples
- **Weak**: password123, john1990
- **Strong**: MyD0g!L0vesT0Run!, 7rU$tN0+h1ng2024

### Password Tips
- Use a password manager to store passwords securely
- Enable two-factor authentication when available
- Never share your passwords with others
- Change passwords if you suspect they've been compromised

## Safe Browsing Practices
### Recognizing Secure Websites
- Look for "https://" in the URL (not just "http://")
- Check for a lock icon in the address bar
- Be cautious of misspelled website names

### Avoiding Suspicious Links
- Hover over links to see the actual destination
- Don't click on links from unknown senders
- Be wary of urgent or threatening messages
- When in doubt, navigate to the website directly

## Protecting Personal Information
### What NOT to Share Online
- Full birth date
- Social security numbers
- Home address
- Phone numbers
- Financial information

### Social Media Privacy
- Review and adjust privacy settings regularly
- Think before you post - once online, always online
- Be selective about friend/follower requests
- Don't post your location in real-time

## Recognizing Scams
### Common Warning Signs
- Requests for immediate action
- Promises of easy money
- Requests for personal information via email
- Poor grammar and spelling
- Threats or urgent language

### What to Do
- Never provide personal information to unsolicited requests
- Verify requests through official channels
- Report suspicious activity
- When in doubt, ask a trusted person for advice

Remember: It's better to be cautious online than to become a victim of cybercrime!
        `,
        quiz: [
          {
            question: 'What makes a password strong?',
            options: [
              'It contains personal information',
              'It is at least 12 characters with mixed characters',
              'It is easy to remember',
              'It is the same for all accounts'
            ],
            correctAnswer: 1
          },
          {
            question: 'What should you look for to identify a secure website?',
            options: [
              'https:// and a lock icon',
              'Colorful design',
              'Many advertisements',
              'Pop-up windows'
            ],
            correctAnswer: 0
          },
          {
            question: 'What should you do if you receive a suspicious email asking for personal information?',
            options: [
              'Reply immediately with the information',
              'Click all the links to investigate',
              'Delete it and verify through official channels',
              'Forward it to all your contacts'
            ],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  {
    id: 'email-communication',
    title: 'Email Communication',
    description: 'Learn professional email writing and management',
    icon: 'Mail',
    lessons: [
      {
        id: 'email-lesson-1',
        title: 'Email Basics and Professional Communication',
        content: `
# Email Basics and Professional Communication

Email is one of the most important forms of digital communication in both personal and professional settings.

## What is Email?
Email (electronic mail) allows you to send messages, documents, and files to people anywhere in the world instantly.

## Parts of an Email Address
An email address has two parts separated by an @ symbol:
- **Username**: The part before @ (e.g., john.doe)
- **Domain**: The part after @ (e.g., gmail.com, outlook.com)

Example: john.doe@gmail.com

## Anatomy of an Email
- **To**: The recipient's email address
- **Subject**: A brief description of what the email is about
- **Body**: The main content of your message
- **CC**: Carbon copy - sends a copy to additional recipients
- **BCC**: Blind carbon copy - recipients can't see who else received the email

## Writing Professional Emails
### Subject Line
- Be clear and specific
- Keep it under 50 characters
- Examples: "Meeting Request for Friday," "Project Update - Week 1"

### Greeting
- Formal: "Dear Mr./Ms. [Last Name]"
- Semi-formal: "Hello [First Name]"
- Informal: "Hi [First Name]"

### Body
- Start with a clear purpose
- Keep paragraphs short
- Use bullet points for lists
- Be polite and respectful

### Closing
- Formal: "Sincerely," "Best regards,"
- Semi-formal: "Best," "Thank you,"
- Include your full name and contact information

## Email Etiquette
- Reply promptly (within 24-48 hours)
- Don't type in ALL CAPS (it looks like shouting)
- Proofread before sending
- Use "Reply All" sparingly
- Keep attachments small and relevant

Good email communication skills are essential in today's digital world!
        `,
        quiz: [
          {
            question: 'What are the two parts of an email address?',
            options: [
              'Name and number',
              'Username and domain',
              'First and last name',
              'Address and phone'
            ],
            correctAnswer: 1
          },
          {
            question: 'What should a good email subject line be?',
            options: [
              'Long and detailed',
              'Clear and specific',
              'Funny and entertaining',
              'Empty'
            ],
            correctAnswer: 1
          },
          {
            question: 'What does BCC stand for?',
            options: [
              'Basic Carbon Copy',
              'Blind Carbon Copy',
              'Best Carbon Copy',
              'Big Carbon Copy'
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  }
];
