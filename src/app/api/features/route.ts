import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { Feature } from '@/types';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: featuresData, error } = await supabase
      .from('features')
      .select(`
        id,
        title,
        description,
        tooltip_text,
        icon,
        status,
        progress,
        vote_count,
        categories ( name )
      `);

    if (error) {
      console.error('Error fetching features:', error);
      return NextResponse.json([], { status: 500 });
    }

    const features: Feature[] = featuresData.map((f: any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      tooltipText: f.tooltip_text || '',
      icon: f.icon,
      status: f.status,
      progress: f.progress,
      votes: f.vote_count,
      category: f.categories?.name,
    }));

    return NextResponse.json(features);
  } catch (error: any) {
    console.error('API /features error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
