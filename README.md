# Eid Greeting Generator

A modern web application for creating and sharing Eid greeting cards with interactive Eidi collection.

## Features

- Create personalized Eid greetings with custom messages
- Design cards with multiple amounts for recipients to choose from
- Share cards via links, QR codes, or social media
- Track payments and see which cards have been claimed
- Interactive card reveal experience for recipients
- Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm 9.6.7 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/eid-greeting-generator.git
cd eid-greeting-generator
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

### Deploying to Vercel

This application is configured for deployment on Vercel.

1. Create a GitHub repository for this project:

```bash
# Replace with your own GitHub repository URL
git remote add origin https://github.com/yourusername/eid-greeting-generator.git
git branch -M main
git push -u origin main
```

2. Sign up or log in to [Vercel](https://vercel.com)

3. Create a new project on Vercel:
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js configuration
   - Leave the default settings and click "Deploy"

4. Your app will be deployed and accessible via a Vercel URL

### Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions for DNS configuration

## Audio Files

The application uses sound effects for card interactions:

- `/public/sounds/card-flip.mp3` - Played when a card is flipped
- `/public/sounds/success.mp3` - Played when a user reveals their Eidi amount

These files are currently placeholders. Replace them with your own audio files for a better experience.

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set this to your actual domain name.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com)

---

Made with ❤️ for Eid celebrations | [Demo](https://eid-greeting-generator.vercel.app)
