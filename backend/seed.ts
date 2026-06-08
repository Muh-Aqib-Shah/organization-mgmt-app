import { supabase } from '../frontend/src/lib/supabase';

async function seedDatabase() {
  console.log('Seeding started...');

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'admin@demo.com')
    .single();

  if (userError || !userData) {
    console.error('Admin user not found. Please create admin@demo.com first.');
    return;
  }

  const adminUserId = userData.id;

  const mockOrgs = [
    {
      name: 'Oakridge High School',
      type: 'school',
      created_by: adminUserId,
      school_district: 'District 12 - Metro South',
    },
    {
      name: 'Beacon Tech Academy',
      type: 'school',
      created_by: adminUserId,
      school_district: 'District 05 - West Valley',
    },
    {
      name: 'Crestview Elementary',
      type: 'school',
      created_by: adminUserId,
      school_district: 'District 09 - Northshore',
    },
    {
      name: 'Stark Industries',
      type: 'business',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'Acme Corporation',
      type: 'business',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'Apex Finance Group',
      type: 'business',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'Hooli Inc',
      type: 'business',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'Global Health Initiative',
      type: 'nonprofit',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'EcoSphere Foundation',
      type: 'nonprofit',
      created_by: adminUserId,
      school_district: null,
    },
    {
      name: 'Red Cross Alliance',
      type: 'nonprofit',
      created_by: adminUserId,
      school_district: null,
    },
  ];

  const { data: insertedOrgs, error: orgsError } = await supabase
    .from('organizations')
    .insert(mockOrgs)
    .select();

  if (orgsError || !insertedOrgs) {
    console.error('Error inserting organizations:', orgsError);
    return;
  }

  console.log(`10 Organizations created with dynamic IDs.`);

  const membersPayload: unknown[] = [];

  insertedOrgs.forEach((org) => {
    if (org.name === 'Oakridge High School') {
      membersPayload.push(
        {
          organization_id: org.id,
          user_id: null,
          email: 'principal@oakridge.edu',
          status: 'active',
          role: 'admin',
          invited_at: new Date(),
          joined_at: new Date(),
        },
        {
          organization_id: org.id,
          user_id: null,
          email: 'teacher1@oakridge.edu',
          status: 'invited',
          role: 'member',
          invited_at: new Date(),
          joined_at: null,
        },
      );
    }

    if (org.name === 'Stark Industries') {
      const starkEmails = [
        'pepper.potts@stark.com',
        'happy.hogan@stark.com',
        'tony.stark@stark.com',
        'rhodey@stark.com',
        'jarvis@stark.com',
        'friday@stark.com',
        'peter.parker@stark.com',
      ];
      starkEmails.forEach((email, idx) => {
        membersPayload.push({
          organization_id: org.id,
          user_id: null,
          email: email,
          status: idx < 3 ? 'active' : 'invited',
          role: idx === 0 ? 'admin' : 'member',
          invited_at: new Date(),
          joined_at: idx < 3 ? new Date() : null,
        });
      });
    }

    if (org.name === 'Red Cross Alliance') {
      // 10 members dynamic boundary check data bundle
      for (let i = 1; i <= 9; i++) {
        membersPayload.push({
          organization_id: org.id,
          user_id: null,
          email: `volunteer.${i}@redcross.org`,
          status: i <= 4 ? 'active' : 'invited',
          role: 'member',
          invited_at: new Date(),
          joined_at: i <= 4 ? new Date() : null,
        });
      }
    }
  });

  if (membersPayload.length > 0) {
    const { error: membersError } = await supabase
      .from('organization_members')
      .insert(membersPayload);

    if (membersError) {
      console.error('Error inserting members:', membersError);
    } else {
      console.log(
        '🎉 Successfully seeded all organizational members dynamically!',
      );
    }
  }
}

seedDatabase();
