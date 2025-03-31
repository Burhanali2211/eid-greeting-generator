# Eid Greeting Generator

A beautiful, interactive Eid greeting generator that allows users to create personalized Eid greetings with an exciting Eidi feature. Recipients can select one of three Eidi cards to reveal their gift amount.

![Eid Greeting Generator](https://placehold.co/600x400?text=Eid+Greeting+Generator)

## Features

- **Create personalized Eid greetings** with custom messages and recipient names
- **Interactive Eidi cards** – Recipients can pick one of three cards to reveal their Eidi amount
- **Real-time updates** – See when recipients claim their Eidi
- **Dashboard** – View all sent greetings and their statuses
- **Responsive design** – Works beautifully on mobile and desktop
- **Easy sharing** – Share greetings via direct links, social media, or messaging apps

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with TypeScript and React Server Components
- **Backend/Database**: [Supabase](https://supabase.io/) for real-time database and authentication
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Eid-themed colors
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for lightweight, efficient state management
- **Icons**: SVG icons and [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/)
- [Supabase account](https://app.supabase.io/)

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

3. Set up your environment variables:
   - Copy the `.env.local.example` to `.env.local`
   - Update with your Supabase credentials from your Supabase project dashboard

4. Set up your Supabase database:
   - Create a table called `greetings` with the following schema:
     ```sql
     create table public.greetings (
       id uuid default gen_random_uuid() primary key,
       created_at timestamp with time zone default now(),
       sender_id text not null,
       recipient_name text not null,
       message text not null,
       amounts integer[] not null,
       selected_card integer
     );
     ```
   - Set up Row Level Security (RLS) policies if needed
   - Enable real-time functionality for the `greetings` table

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## Usage

1. **Create a greeting**: Fill in the recipient's name, a custom message, and three Eidi amounts
2. **Share the greeting**: Copy the generated link or use the share button
3. **Recipient experience**: The recipient opens the link, views the greeting, and picks an Eidi card to reveal their gift
4. **Track greetings**: View all sent greetings and see their claim status in the dashboard

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspiration: Traditional Eidi giving during Eid celebrations
- SVG Icons: [Lucide](https://lucide.dev/)
- Background patterns: Custom Eid-themed designs

---

Made with ❤️ for Eid celebrations | [Demo](https://eid-greeting-generator.vercel.app)
