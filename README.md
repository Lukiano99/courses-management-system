# Courses Management System

This project was initialized using the T3 Stack, a powerful full-stack framework that integrates TypeScript, Next.js, tRPC, and Prisma for seamless development.

## Technologies Used

- **Next.js**: React framework for server-rendered applications.
- **TypeScript**: Strongly typed JavaScript for improved development experience.
- **tRPC**: End-to-end typesafe API between client and server.
- **Prisma**: Type-safe ORM for database interactions.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Supabase**: Ideal for building scalable applications with a PostgreSQL database.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/project-name.git

   ```

2. **Navigate to the project directory**:

   ```bash
   cd project-name

   ```

3. **Install dependencies**:

   ```bash
   pnpm install

   ```

4. **Running the Development Server**:

   ```bash
   pnpm dev

   ```

5. **Running the Development Server**:

   ```bash
   pnpm dev

   Open http://localhost:3000 to view the application in your browser.
   ```

## Project Structure

- **`src/`**: Application source code (components, pages, utils, etc.).
- **`prisma/`**: Database schema and Prisma configuration.
- **`public/`**: Static assets.
- **`styles/`**: Global styles (using TailwindCSS).


- ## Changelog

### [v1.0.2] - 2024-09-25
- **Video Upload**: Users can now upload their videos effortlessly through **UploadThing**, ensuring a smooth and reliable experience.
- **Video Processing with Mux**: Once uploaded, videos are automatically processed using **Mux**, a platform designed to handle everything needed to build a stunning web player. Mux simplifies video delivery, ensuring high-quality playback across any page or app.
  
## Why Mux?

- **Unified Platform**: Mux provides a single solution for all your video streaming needs, enabling you to embed a beautiful, responsive web player on your platform with minimal setup.
- **Optimized for Performance**: Mux processes and streams videos with optimal quality and low latency, ensuring the best viewing experience for your users.
- **Free Plan Available**: Mux offers a **free tier** that doesn’t require a credit card for setup. This plan includes a **Mux badge** and **watermark** on the videos, which makes it an excellent choice for **side projects** and smaller applications without any upfront costs.

### [v1.0.1] - 2024-09-23
- Added image upload functionality using **Uploadthing**.
  - Users can now upload images directly to the platform.
  - Integrated Uploadthing API for seamless file uploads and storage.

### [v1.0.0] - 2024-09-15
- Initial release with full functionality for managing courses, authentication, and database management with Prisma.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
