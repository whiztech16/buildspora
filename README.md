# BuildSpora Frontend

BuildSpora is a construction project management and financial escrow platform that connects clients, contractors, and suppliers. This is the React frontend for the application.

## Demo Access

Thank you for reviewing BuildSpora. To explore the platform without creating a new account, please use the demo credentials below.

### Live Application
- **Frontend**: [https://buildspora.vercel.app/](https://buildspora.vercel.app/)
- **Backend API**: [https://buildspora-backend.onrender.com](https://buildspora-backend.onrender.com)

### Getting Started
1. Open the BuildSpora application.
2. Click **Start Project** on the landing page.
3. On the Role Selection screen, click the **Sign In** link located below the available roles.
4. Sign in using one of the demo accounts below.

### Demo Accounts

#### Client Account
- **Email**: `fortuneokpara7@gmail.com`
- **Password**: `Nkemakolam@19`

**Use this account to:**
- Create and manage construction projects
- Fund projects using Virtual Accounts
- Monitor milestone progress
- Review submitted milestones
- Approve or reject milestone submissions
- Make contractor or supplier payments
- View reconciliation reports and project dashboards

#### Contractor Account
- **Email**: `ssgstoresnoreply@gmail.com`
- **Password**: `Nkemakolam`

**Use this account to:**
- View assigned projects
- Submit milestones
- Upload live site progress with geolocation tracking
- Track milestone status
- Receive payments
- Withdraw available funds

---

## Tech Stack
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Fetching**: Axios

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and configure the environment variables as needed (e.g., your backend API URL).
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## Build for Production

To create a production build, run:
```bash
npm run build
```
This will compile TypeScript and bundle the application into the `dist` folder.
