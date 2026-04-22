export interface Team {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export const TEAMS: { [key: string]: Team } = {
  CSK: {
    id: 'CSK',
    name: 'Chennai Super Kings',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/CSK.png',
    color: '#FFFF33'
  },
  MI: {
    id: 'MI',
    name: 'Mumbai Indians',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/MI.png',
    color: '#004BA0'
  },
  RCB: {
    id: 'RCB',
    name: 'Royal Challengers Bengaluru',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/RCB.png',
    color: '#EC1C24'
  },
  KKR: {
    id: 'KKR',
    name: 'Kolkata Knight Riders',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/KKR.png',
    color: '#3A225D'
  },
  DC: {
    id: 'DC',
    name: 'Delhi Capitals',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/DC.png',
    color: '#0078BC'
  },
  RR: {
    id: 'RR',
    name: 'Rajasthan Royals',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/RR.png',
    color: '#EB008B'
  },
  PBKS: {
    id: 'PBKS',
    name: 'Punjab Kings',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/PBKS.png',
    color: '#D71920'
  },
  SRH: {
    id: 'SRH',
    name: 'Sunrisers Hyderabad',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/SRH.png',
    color: '#F26522'
  },
  LSG: {
    id: 'LSG',
    name: 'Lucknow Super Giants',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/LSG.png',
    color: '#0057E7'
  },
  GT: {
    id: 'GT',
    name: 'Gujarat Titans',
    logo: 'https://www.iplt20.com/assets/images/teams-logo-2024/GT.png',
    color: '#1B2133'
  }
};
