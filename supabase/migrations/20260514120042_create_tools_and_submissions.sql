-- Supabase Migration SQL for creating tools and submissions tables

-- Create tools table
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    data JSONB,
    status TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Enable Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "tools_select_all" ON tools FOR SELECT USING (true);
CREATE POLICY "submissions_insert_authenticated" ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');