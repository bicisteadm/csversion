This will typically be used after doing `File -> New -> Project` and makes it easy to follow the [semantic versioning](<http://semver.org/>) convention.

# Install using NPM

```bash
npm install csversion -g
```

[![NPM](https://nodei.co/npm/csversion.png)](https://www.npmjs.com/package/csversion)

# Usage

```bash
csversion <csproj-path> [<version-filename>] [<version>]
```

Example specifying the `version-filename` and `version` explicitly.

```bash
csversion my-project.csproj version.txt 0.1.0-alpha
```

**Important: if the `csproj-path` contains spaces, you must surround it with quotes.**

# What it does

Using the example values from above.

* Creates `version.txt` in the project directory, if it doesn't exist.
* Copies `BuildCommon.targets` to `build/BuildCommon.targets`, if it doesn't already exist.
* Adds an import element to the project file, if it doesn't already exist.
* Comments out the version related attributes in `AssemblyInfo.cs`, if not commented out.

# Result

Using the example values from above, when the project is built, the following attributes will be set in `Properties\AssemblyVersion.cs`:

* `[assembly: System.Reflection.AssemblyVersion("0.1.0")]`
* `[assembly: System.Reflection.AssemblyFileVersion("0.1.0")]`
* `[assembly: System.Reflection.AssemblyInformationalVersion("0.1.0-alpha")]`

Change the version in `version.txt` and build to change the version number.

# Expected directory structure

```
.
+-- src (may be named whatever you want)
|   +-- project-name
|       +-- project-name.csproj
```  