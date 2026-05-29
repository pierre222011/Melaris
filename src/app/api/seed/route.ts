import { NextResponse } from 'next/server';
import { featuresData } from '@/data/features';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // 1. Extract unique categories
    const categories = Array.from(new Set(featuresData.map(f => f.category)));
    
    console.log('Inserting categories...', categories);
    
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .upsert(
        categories.map(name => ({ name })),
        { onConflict: 'name', ignoreDuplicates: true }
      )
      .select();
      
    if (catError) {
      console.error('Error inserting categories', catError);
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    // Since ignoreDuplicates might not return existing rows if they exist, let's just fetch them all
    const { data: allCategories, error: fetchCatError } = await supabase
      .from('categories')
      .select('*');

    if (fetchCatError) {
      return NextResponse.json({ error: fetchCatError.message }, { status: 500 });
    }

    const categoryMap = new Map(allCategories?.map(c => [c.name, c.id]));

    // 2. Prepare features for insertion
    const featuresToInsert = featuresData.map(f => ({
      // We don't use the hardcoded string id in the DB, Supabase uses UUID.
      // We will just let Supabase generate the UUID, or we could pass the string id if we change the schema.
      // Wait, our schema uses UUID for feature id.
      title: f.title,
      description: f.description,
      tooltip_text: f.tooltipText,
      icon: f.icon,
      status: f.status,
      progress: f.progress || 0,
      vote_count: f.votes || 0,
      category_id: categoryMap.get(f.category)
    }));

    console.log(`Inserting ${featuresToInsert.length} features...`);
    
    // First, let's delete all existing features to avoid duplicates if we run this multiple times
    await supabase.from('features').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all

    const { error: featError } = await supabase
      .from('features')
      .insert(featuresToInsert);

    if (featError) {
      console.error('Error inserting features', featError);
      return NextResponse.json({ error: featError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Seed successful!', categories: allCategories?.length, features: featuresToInsert.length });
  } catch (error: any) {
    console.error('Seed exception', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
