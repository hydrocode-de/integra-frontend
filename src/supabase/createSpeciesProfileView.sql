create view species_profile_full_view as select species.latin_name, species.type, species_profile.* from species_profile join 
species 
on species_profile.species_id = species.id