export async function getUserNameById(userId: string): Promise<string> {
  try {
    const res = await fetch(`http://localhost:3001/users/${userId}`);
    const user = await res.json();
    return user.name || user.email || 'Usuário';
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return 'Desconhecido';
  }
}
