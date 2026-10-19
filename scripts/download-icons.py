import pathlib,subprocess,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1]
names=['phone','recording-01','arrow-up','microphone-01','recording-03','navigation-pointer-01','car-01','expand-01','refresh-ccw-01','x-close','star-01','star-04','sunset','waves','lock-01','flash','camera-01','face-smile','film-01','trophy-01','video-recorder','marker-pin-01','user-01','globe-01','bookmark','bookmark-check','phone-01','chevron-down','chevron-right','chevron-left','play','pause-circle','headphones-01','route','check']
def fetch(name):
 subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','60',f'https://raw.githubusercontent.com/untitleduico/icons/main/icons/{name}.svg','-o',str(root/'assets/icons'/f'{name}.svg')],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as p:list(p.map(fetch,names))
subprocess.run(['curl','-L','--fail','--silent','https://raw.githubusercontent.com/untitleduico/icons/main/LICENSE','-o',str(root/'assets/icons/LICENSE')],check=True)
(root/'src/icons.ts').write_text('export const icons = {\n'+''.join(f'  "{n}": require("../assets/icons/{n}.svg"),\n' for n in names)+'} as const;\nexport type IconName = keyof typeof icons;\n')
print(f'Downloaded {len(names)} Untitled UI icons')
