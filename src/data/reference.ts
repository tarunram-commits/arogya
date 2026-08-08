import type { BloodGroup, DoctorUser, Gender } from '../types';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

export const VILLAGES = [
'Hosahalli',
'Kadalur',
'Beeranahalli',
'Nandipura',
'Chikkabidare',
'Malleshwara',
'Sompura',
'Yelahanka Rural'];


export const HOSPITALS: {name: string;city: string;departments: string[];}[] = [
{
  name: 'District General Hospital, Tumakuru',
  city: 'Tumakuru',
  departments: ['Cardiology', 'General Medicine', 'Orthopaedics', 'Obstetrics & Gynaecology', 'Paediatrics']
},
{
  name: 'Jayadeva Institute of Cardiology',
  city: 'Bengaluru',
  departments: ['Cardiology', 'Cardiothoracic Surgery', 'Emergency Medicine']
},
{
  name: 'Victoria Hospital, Bengaluru',
  city: 'Bengaluru',
  departments: ['General Surgery', 'Neurology', 'Nephrology', 'Pulmonology', 'Emergency Medicine']
},
{
  name: 'KIMS Taluk Hospital, Hubballi',
  city: 'Hubballi',
  departments: ['General Medicine', 'Ophthalmology', 'ENT', 'Dermatology']
}];


export const REFERRAL_REASONS = [
'Specialist consultation required',
'Diagnostic facility unavailable at PHC',
'Surgical intervention needed',
'Critical vitals requiring higher care',
'ICU / emergency admission',
'Second opinion on diagnosis'];


export const USERS: DoctorUser[] = [
{
  id: 'u_phc',
  name: 'Dr. Meera Kulkarni',
  role: 'phc',
  designation: 'Medical Officer',
  facility: 'PHC Hosahalli, Tumakuru District',
  registration: 'KMC-84213'
},
{
  id: 'u_spec',
  name: 'Dr. Arjun Rao',
  role: 'specialist',
  designation: 'Consultant Cardiologist',
  facility: 'District General Hospital, Tumakuru',
  registration: 'KMC-51907'
}];