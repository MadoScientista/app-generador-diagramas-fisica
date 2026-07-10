import type { PhysicsModule, ModuleInfo } from './types.ts';

export class ModuleRegistry {
  private modules: Map<string, PhysicsModule> = new Map();

  register(module: PhysicsModule): void {
    if (this.modules.has(module.info.id)) {
      throw new Error(`Module "${module.info.id}" is already registered.`);
    }
    this.modules.set(module.info.id, module);
  }

  get(id: string): PhysicsModule | undefined {
    return this.modules.get(id);
  }

  list(): ModuleInfo[] {
    return Array.from(this.modules.values()).map((m) => m.info);
  }

  has(id: string): boolean {
    return this.modules.has(id);
  }
}
