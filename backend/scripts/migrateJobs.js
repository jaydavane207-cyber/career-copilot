// backend/scripts/migrateJobs.js
const { sequelize } = require('../config/database');

async function migrateJobsTable() {
  try {
    await sequelize.authenticate();
    const dialect = sequelize.getDialect();
    console.log(`Checking jobs table schema on ${dialect}...`);

    if (dialect === 'sqlite') {
      // Recreate clean table for SQLite with new schema
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS jobs_new (
          id UUID PRIMARY KEY,
          userId UUID NOT NULL,
          companyName VARCHAR(255) NOT NULL,
          jobTitle VARCHAR(255) NOT NULL,
          positionTitle VARCHAR(255),
          jobLink VARCHAR(255),
          jobUrl VARCHAR(255),
          stage VARCHAR(50) DEFAULT 'applied',
          status VARCHAR(50) DEFAULT 'Applied',
          dateApplied DATE,
          appliedDate DATE,
          interviewDate DATE,
          notes TEXT,
          salary VARCHAR(255),
          salaryRange VARCHAR(255),
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        );
      `);

      // Check if old jobs table exists
      const [tableCheck] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'");
      if (tableCheck.length > 0) {
        const [cols] = await sequelize.query('PRAGMA table_info(jobs)');
        const colNames = cols.map(c => c.name);

        const hasJobTitle = colNames.includes('jobTitle');
        const hasPosTitle = colNames.includes('positionTitle');
        const hasStage = colNames.includes('stage');
        const hasStatus = colNames.includes('status');
        const hasJobLink = colNames.includes('jobLink');
        const hasJobUrl = colNames.includes('jobUrl');
        const hasDateApplied = colNames.includes('dateApplied');
        const hasAppliedDate = colNames.includes('appliedDate');
        const hasSalary = colNames.includes('salary');
        const hasSalaryRange = colNames.includes('salaryRange');
        const hasInterviewDate = colNames.includes('interviewDate');

        const titleExpr = hasJobTitle && hasPosTitle
          ? "COALESCE(jobTitle, positionTitle, 'Role')"
          : hasJobTitle
          ? "COALESCE(jobTitle, 'Role')"
          : "COALESCE(positionTitle, 'Role')";

        const linkExpr = hasJobLink && hasJobUrl
          ? "COALESCE(jobLink, jobUrl)"
          : hasJobLink
          ? "jobLink"
          : hasJobUrl
          ? "jobUrl"
          : "NULL";

        const stageExpr = hasStage
          ? "COALESCE(stage, 'applied')"
          : hasStatus
          ? "CASE WHEN lower(status) LIKE '%interview%' THEN 'interview' WHEN lower(status) LIKE '%offer%' THEN 'offer' ELSE 'applied' END"
          : "'applied'";

        const appliedExpr = hasDateApplied && hasAppliedDate
          ? "COALESCE(dateApplied, appliedDate)"
          : hasDateApplied
          ? "dateApplied"
          : hasAppliedDate
          ? "appliedDate"
          : "date('now')";

        const interviewExpr = hasInterviewDate ? "interviewDate" : "NULL";

        const salaryExpr = hasSalary && hasSalaryRange
          ? "COALESCE(salary, salaryRange)"
          : hasSalary
          ? "salary"
          : hasSalaryRange
          ? "salaryRange"
          : "NULL";

        await sequelize.query(`
          INSERT OR REPLACE INTO jobs_new (
            id, userId, companyName, jobTitle, positionTitle,
            jobLink, jobUrl, stage, status,
            dateApplied, appliedDate, interviewDate, notes,
            salary, salaryRange, createdAt, updatedAt
          )
          SELECT
            id,
            userId,
            companyName,
            ${titleExpr} AS jobTitle,
            ${titleExpr} AS positionTitle,
            ${linkExpr} AS jobLink,
            ${linkExpr} AS jobUrl,
            ${stageExpr} AS stage,
            ${stageExpr} AS status,
            ${appliedExpr} AS dateApplied,
            ${appliedExpr} AS appliedDate,
            ${interviewExpr} AS interviewDate,
            notes,
            ${salaryExpr} AS salary,
            ${salaryExpr} AS salaryRange,
            createdAt,
            updatedAt
          FROM jobs;
        `);

        await sequelize.query('DROP TABLE jobs');
      }

      await sequelize.query('ALTER TABLE jobs_new RENAME TO jobs');
      console.log('Jobs table SQLite migration completed successfully.');
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        ALTER TABLE jobs 
        ADD COLUMN IF NOT EXISTS "jobTitle" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "jobLink" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "stage" VARCHAR(50) DEFAULT 'applied',
        ADD COLUMN IF NOT EXISTS "dateApplied" DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS "interviewDate" DATE,
        ADD COLUMN IF NOT EXISTS "salary" VARCHAR(255);
      `);
      console.log('Jobs table PostgreSQL migration completed successfully.');
    }
  } catch (error) {
    console.error('Error during jobs table migration:', error);
    throw error;
  }
}

if (require.main === module) {
  migrateJobsTable().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = migrateJobsTable;
