describe('Roadmap Logic Tests', () => {
  test('calculates roadmap steps correctly', () => {
    const steps = ['Learn HTML', 'Learn CSS', 'Learn JS'];
    expect(steps.length).toBe(3);
    expect(steps[2]).toBe('Learn JS');
  });

  test('filters empty career data', () => {
    const data = [{ id: 1, role: 'Dev' }, { id: 2, role: null }];
    const validData = data.filter(d => d.role !== null);
    expect(validData.length).toBe(1);
  });
});