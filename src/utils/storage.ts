import type { StudentProfile, ClassGrade, ClassSection } from '../types';

const STORAGE_KEY_STUDENTS = 'khaitan_students_v2';
const STORAGE_KEY_CURRENT_USER = 'khaitan_active_user_v2';

export function getStoredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStudents(students: StudentProfile[]): void {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
}

export function getCurrentUser(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    const user: StudentProfile = JSON.parse(raw);
    const all = getStoredStudents();
    const found = all.find(s => s.id === user.id || s.email.toLowerCase() === user.email.toLowerCase());
    return found || user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StudentProfile | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

export function saveOrUpdateStudent(profile: StudentProfile): StudentProfile {
  const all = getStoredStudents();
  const existingIdx = all.findIndex(
    s => s.email.toLowerCase() === profile.email.toLowerCase() || s.id === profile.id
  );

  let updated: StudentProfile;
  if (existingIdx >= 0) {
    updated = {
      ...all[existingIdx],
      ...profile,
      points: Math.max(all[existingIdx].points, profile.points),
      huntLevelReached: Math.max(all[existingIdx].huntLevelReached, profile.huntLevelReached),
      passwordGameHighScore: Math.max(all[existingIdx].passwordGameHighScore, profile.passwordGameHighScore),
      phishGuardScore: Math.max(all[existingIdx].phishGuardScore, profile.phishGuardScore),
      easterEggsFound: Array.from(new Set([...all[existingIdx].easterEggsFound, ...profile.easterEggsFound])),
      badges: Array.from(new Set([...all[existingIdx].badges, ...profile.badges]))
    };
    all[existingIdx] = updated;
  } else {
    updated = profile;
    all.push(updated);
  }

  saveStudents(all);
  setCurrentUser(updated);
  return updated;
}

export function addPointsToCurrentStudent(addedPoints: number, reasonBadge?: string): StudentProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const newPoints = current.points + addedPoints;
  const newBadges = [...current.badges];
  if (reasonBadge && !newBadges.includes(reasonBadge)) {
    newBadges.push(reasonBadge);
  }

  const updated: StudentProfile = {
    ...current,
    points: newPoints,
    badges: newBadges
  };

  return saveOrUpdateStudent(updated);
}

export function getSectionMembers(grade: ClassGrade, section: ClassSection): StudentProfile[] {
  const all = getStoredStudents();
  return all
    .filter(s => s.grade === grade && s.section === section)
    .sort((a, b) => b.points - a.points);
}

export function getAllSectionRankings(): { grade: ClassGrade; section: ClassSection; totalPoints: number; studentCount: number }[] {
  const all = getStoredStudents();
  const map = new Map<string, { grade: ClassGrade; section: ClassSection; totalPoints: number; studentCount: number }>();

  all.forEach(student => {
    const key = `${student.grade}-${student.section}`;
    const existing = map.get(key) || {
      grade: student.grade,
      section: student.section,
      totalPoints: 0,
      studentCount: 0
    };
    existing.totalPoints += student.points;
    existing.studentCount += 1;
    map.set(key, existing);
  });

  return Array.from(map.values()).sort((a, b) => b.totalPoints - a.totalPoints);
}
